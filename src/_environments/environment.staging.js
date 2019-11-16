var domainInfo = {
  domain: '157.245.165.216', // staging  
  port: '8080'
};

var domainPort = domainInfo.domain + ':' + domainInfo.port;

var environment = {
  production: false,
  domainPort: domainPort,
  apiUrl: 'http://' + domainPort
};

export { domainInfo, domainPort, environment }
export default environment;

