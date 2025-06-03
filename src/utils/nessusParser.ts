
import { Vulnerability } from '@/types/vulnerability';

export interface NessusHost {
  ip: string;
  hostname: string;
  os: string;
  vulnerabilities: NessusVulnerability[];
}

export interface NessusVulnerability {
  pluginId: string;
  pluginName: string;
  severity: string;
  severityIndex: number;
  riskFactor: string;
  description: string;
  solution: string;
  synopsis: string;
  pluginOutput: string;
  cvssScore?: number;
  cvssVector?: string;
  cve?: string[];
  bid?: string[];
  xref?: string[];
  seeAlso?: string[];
  pluginModificationDate: string;
  pluginPublicationDate: string;
  vulnPublicationDate?: string;
  exploitabilityEase?: string;
  exploitAvailable?: boolean;
  exploitFrameworkCore?: boolean;
  exploitFrameworkMetasploit?: boolean;
  exploitFrameworkCanvas?: boolean;
  port: number;
  protocol: string;
  service: string;
}

export interface NessusScanResult {
  hosts: NessusHost[];
  scanInfo: {
    scanStart: Date;
    scanEnd: Date;
    scannerVersion: string;
    policyName: string;
    targetHosts: string[];
  };
  vulnerabilitySummary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
    total: number;
  };
}

export class NessusParser {
  static async parseNessusFile(file: File): Promise<NessusScanResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const xmlContent = event.target?.result as string;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
          
          const result = this.parseNessusXML(xmlDoc);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse Nessus file: ${error}`));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private static parseNessusXML(xmlDoc: Document): NessusScanResult {
    const hosts: NessusHost[] = [];
    const hostElements = xmlDoc.querySelectorAll('ReportHost');
    
    // Parse scan info
    const policyElement = xmlDoc.querySelector('Policy');
    const scanStart = this.getElementText(xmlDoc, 'ScanStart');
    const scanEnd = this.getElementText(xmlDoc, 'ScanEnd');
    
    hostElements.forEach(hostElement => {
      const host = this.parseHost(hostElement);
      if (host) {
        hosts.push(host);
      }
    });

    const vulnerabilitySummary = this.calculateVulnerabilitySummary(hosts);

    return {
      hosts,
      scanInfo: {
        scanStart: scanStart ? new Date(parseInt(scanStart) * 1000) : new Date(),
        scanEnd: scanEnd ? new Date(parseInt(scanEnd) * 1000) : new Date(),
        scannerVersion: this.getElementText(xmlDoc, 'ScannerVersion') || 'Unknown',
        policyName: policyElement?.getAttribute('name') || 'Default Policy',
        targetHosts: hosts.map(h => h.ip)
      },
      vulnerabilitySummary
    };
  }

  private static parseHost(hostElement: Element): NessusHost | null {
    const hostProperties = hostElement.querySelector('HostProperties');
    if (!hostProperties) return null;

    const ip = this.getHostProperty(hostProperties, 'host-ip') || 'Unknown';
    const hostname = this.getHostProperty(hostProperties, 'host-fqdn') || 
                    this.getHostProperty(hostProperties, 'netbios-name') || 
                    this.getHostProperty(hostProperties, 'hostname') || ip;
    const os = this.getHostProperty(hostProperties, 'operating-system') || 'Unknown';

    const vulnerabilities: NessusVulnerability[] = [];
    const reportItems = hostElement.querySelectorAll('ReportItem');

    reportItems.forEach(item => {
      const vuln = this.parseVulnerability(item);
      if (vuln) {
        vulnerabilities.push(vuln);
      }
    });

    return {
      ip,
      hostname,
      os,
      vulnerabilities
    };
  }

  private static parseVulnerability(item: Element): NessusVulnerability | null {
    const pluginId = item.getAttribute('pluginID');
    const pluginName = item.getAttribute('pluginName');
    const port = item.getAttribute('port');
    const protocol = item.getAttribute('protocol');
    const service = item.getAttribute('svc_name');
    const severity = item.getAttribute('severity');

    if (!pluginId || !pluginName) return null;

    const severityIndex = parseInt(severity || '0');
    const riskFactor = this.getElementText(item, 'risk_factor') || 'None';
    
    return {
      pluginId,
      pluginName,
      severity: this.mapSeverity(severityIndex),
      severityIndex,
      riskFactor,
      description: this.getElementText(item, 'description') || '',
      solution: this.getElementText(item, 'solution') || '',
      synopsis: this.getElementText(item, 'synopsis') || '',
      pluginOutput: this.getElementText(item, 'plugin_output') || '',
      cvssScore: parseFloat(this.getElementText(item, 'cvss_base_score') || '0'),
      cvssVector: this.getElementText(item, 'cvss_vector'),
      cve: this.getElementTextArray(item, 'cve'),
      bid: this.getElementTextArray(item, 'bid'),
      xref: this.getElementTextArray(item, 'xref'),
      seeAlso: this.getElementTextArray(item, 'see_also'),
      pluginModificationDate: this.getElementText(item, 'plugin_modification_date') || '',
      pluginPublicationDate: this.getElementText(item, 'plugin_publication_date') || '',
      vulnPublicationDate: this.getElementText(item, 'vuln_publication_date'),
      exploitabilityEase: this.getElementText(item, 'exploitability_ease'),
      exploitAvailable: this.getElementText(item, 'exploit_available') === 'true',
      exploitFrameworkCore: this.getElementText(item, 'exploit_framework_core') === 'true',
      exploitFrameworkMetasploit: this.getElementText(item, 'exploit_framework_metasploit') === 'true',
      exploitFrameworkCanvas: this.getElementText(item, 'exploit_framework_canvas') === 'true',
      port: parseInt(port || '0'),
      protocol: protocol || 'tcp',
      service: service || 'unknown'
    };
  }

  private static getHostProperty(hostProperties: Element, name: string): string | null {
    const tag = hostProperties.querySelector(`tag[name="${name}"]`);
    return tag?.textContent || null;
  }

  private static getElementText(element: Element, tagName: string): string | null {
    const tag = element.querySelector(tagName);
    return tag?.textContent || null;
  }

  private static getElementTextArray(element: Element, tagName: string): string[] {
    const tags = element.querySelectorAll(tagName);
    return Array.from(tags).map(tag => tag.textContent || '').filter(text => text);
  }

  private static mapSeverity(severityIndex: number): string {
    switch (severityIndex) {
      case 4: return 'Critical';
      case 3: return 'High';
      case 2: return 'Medium';
      case 1: return 'Low';
      case 0: return 'Informational';
      default: return 'Unknown';
    }
  }

  private static calculateVulnerabilitySummary(hosts: NessusHost[]) {
    const summary = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      informational: 0,
      total: 0
    };

    hosts.forEach(host => {
      host.vulnerabilities.forEach(vuln => {
        switch (vuln.severity.toLowerCase()) {
          case 'critical':
            summary.critical++;
            break;
          case 'high':
            summary.high++;
            break;
          case 'medium':
            summary.medium++;
            break;
          case 'low':
            summary.low++;
            break;
          case 'informational':
            summary.informational++;
            break;
        }
        summary.total++;
      });
    });

    return summary;
  }

  static convertToStandardVulnerabilities(nessusResult: NessusScanResult): Vulnerability[] {
    const vulnerabilities: Vulnerability[] = [];
    let idCounter = 1;

    nessusResult.hosts.forEach(host => {
      host.vulnerabilities.forEach(nessusVuln => {
        const vulnerability: Vulnerability = {
          id: `nessus-${idCounter++}`,
          title: nessusVuln.pluginName,
          severity: nessusVuln.severity as 'Critical' | 'High' | 'Medium' | 'Low',
          cvss: nessusVuln.cvssScore || 0,
          host: host.hostname,
          port: nessusVuln.port,
          protocol: nessusVuln.protocol,
          description: nessusVuln.description,
          solution: nessusVuln.solution,
          discoveredDate: nessusResult.scanInfo.scanStart,
          lastSeen: nessusResult.scanInfo.scanEnd,
          status: 'Open',
          cve: nessusVuln.cve?.[0],
          category: this.categorizeVulnerability(nessusVuln.pluginName),
          riskScore: nessusVuln.cvssScore || this.calculateRiskScore(nessusVuln.severity),
          businessImpact: this.mapBusinessImpact(nessusVuln.severity),
          exploitability: nessusVuln.exploitAvailable ? 'High' : 'Low',
          affectedAssets: [host.hostname],
          slaStatus: 'On Track',
          remediationEffort: this.mapRemediationEffort(nessusVuln.severity),
          verificationStatus: 'Pending',
          complianceFrameworks: this.getComplianceFrameworks(nessusVuln.pluginName)
        };

        vulnerabilities.push(vulnerability);
      });
    });

    return vulnerabilities;
  }

  private static categorizeVulnerability(pluginName: string): string {
    const name = pluginName.toLowerCase();
    if (name.includes('sql injection')) return 'SQL Injection';
    if (name.includes('xss') || name.includes('cross-site scripting')) return 'XSS';
    if (name.includes('rce') || name.includes('remote code')) return 'RCE';
    if (name.includes('dos') || name.includes('denial of service')) return 'DoS';
    if (name.includes('privilege') || name.includes('escalation')) return 'Privilege Escalation';
    if (name.includes('information disclosure')) return 'Information Disclosure';
    if (name.includes('buffer overflow')) return 'Buffer Overflow';
    if (name.includes('csrf')) return 'CSRF';
    if (name.includes('weak') || name.includes('password')) return 'Weak Authentication';
    return 'Other';
  }

  private static calculateRiskScore(severity: string): number {
    switch (severity.toLowerCase()) {
      case 'critical': return 9.5;
      case 'high': return 7.5;
      case 'medium': return 5.5;
      case 'low': return 3.0;
      default: return 1.0;
    }
  }

  private static mapBusinessImpact(severity: string): 'Critical' | 'High' | 'Medium' | 'Low' {
    switch (severity.toLowerCase()) {
      case 'critical': return 'Critical';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      default: return 'Low';
    }
  }

  private static mapRemediationEffort(severity: string): 'Low' | 'Medium' | 'High' {
    switch (severity.toLowerCase()) {
      case 'critical': return 'High';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      default: return 'Low';
    }
  }

  private static getComplianceFrameworks(pluginName: string): string[] {
    const frameworks: string[] = [];
    const name = pluginName.toLowerCase();
    
    if (name.includes('pci') || name.includes('payment')) frameworks.push('PCI-DSS');
    if (name.includes('hipaa') || name.includes('health')) frameworks.push('HIPAA');
    if (name.includes('gdpr') || name.includes('privacy')) frameworks.push('GDPR');
    if (name.includes('sox') || name.includes('financial')) frameworks.push('SOX');
    if (name.includes('iso') || name.includes('27001')) frameworks.push('ISO 27001');
    if (name.includes('nist')) frameworks.push('NIST');
    
    return frameworks.length > 0 ? frameworks : ['General'];
  }
}
