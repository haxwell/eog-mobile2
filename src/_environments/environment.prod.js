
var domainInfo = {
  domain: '165.227.109.239', // prod
  port: '8080'
};

var domainPort = domainInfo.domain + ':' + domainInfo.port;

var environment = {
  production: true,
  domainPort: domainPort,
  apiUrl: 'http://' + domainPort
};

export { domainInfo, domainPort, environment }
export default environment;

