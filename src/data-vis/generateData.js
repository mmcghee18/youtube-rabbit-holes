import _ from "lodash";

export function randomData(nodes, width, height) {
  var oldNodes = nodes;
  // generate some data randomly
  nodes = _.chain(_.range(_.random(10, 30)))
    .map(function () {
      var node = {};
      node.key = _.random(0, 30);
      node.size = _.random(4, 10);

      return node;
    })
    .uniq(function (node) {
      return node.key;
    })
    .value();

  if (oldNodes) {
    var add = _.initial(oldNodes, _.random(0, oldNodes.length));
    add = _.rest(add, _.random(0, add.length));

    nodes = _.chain(nodes)
      .union(add)
      .uniq(function (node) {
        return node.key;
      })
      .value();
  }

  maintainNodePositions(oldNodes, nodes, width, height);

  return nodes;
}

function maintainNodePositions(oldNodes, nodes, width, height) {
  var kv = {};
  _.each(oldNodes, function (d) {
    kv[d.key] = d;
  });
  _.each(nodes, function (d) {
    if (kv[d.key]) {
      // if the node already exists, maintain current position
      d.x = kv[d.key].x;
      d.y = kv[d.key].y;
    } else {
      // else assign it a random position near the center
      d.x = width / 2 + _.random(-150, 150);
      d.y = height / 2 + _.random(-25, 25);
    }
  });
}
