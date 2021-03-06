'use strict'

var BASE = 'https://ruby-china.org/api/v3/';
var ACCESS_TOKEN = '495c7bef0f438c5505ebdecabd4fce87ac7764f79ccaed608412f3199041d66d';

function api (api, v) {
  if (v instanceof Object) {
    var parameters = Object.keys(v).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(v[k]);
    }).join('&');
  }else if (v) {
    var parameters = v;
  }else {
    var parameters = '';
  }
  return BASE + api + '?access_token=' + ACCESS_TOKEN + '&' + parameters;
}

function getNodes() {
  return api('nodes.json');
}

function getTopic(id) {
  return api('topics' + '/' + id + '.json');
}

function getComments(topic_id, offset, limit){
	return api('topics/'+ topic_id + '/replies.json', {'offset':offset, 'limit':limit});
}

function getHomeTopics(offset, limit){
	return api('topics.json', {'type':'excellent','offset':offset, 'limit':limit});
}

function getNodeTopics(node_id, offset, limit){
	return api('topics.json', {'node_id':node_id, 'offset':offset, 'limit':limit});
}

module.exports = {
  Nodes:      getNodes,
  Topic:      getTopic,
  Comments:   getComments,
  HomeTopics: getHomeTopics,
	NodeTopics: getNodeTopics,
}
