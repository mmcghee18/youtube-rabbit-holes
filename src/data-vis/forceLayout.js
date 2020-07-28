const width = 960;
const height = 500;

const nodes = [{}, {}, {}, {}, {}];
const force = d3
  .forceSimulation(nodes)
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));
//.on('tick', ticked);

// *****************************************************
// ** d3 functions to manipulate attributes
// *****************************************************

const enterNode = (selection) => {
  selection.classed("node", true);

  selection
    .append("circle")
    .attr("r", (d) => d.size)
    .call(force.drag);

  selection
    .append("text")
    .attr("x", (d) => d.size + 5)
    .attr("dy", ".35em")
    .text((d) => d.key);
};

const updateNode = (selection) => {
  selection.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
};

const enterLink = (selection) => {
  selection.classed("link", true).attr("stroke-width", (d) => d.size);
};

const updateLink = (selection) => {
  selection
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);
};

const updateGraph = (selection) => {
  selection.selectAll(".node").call(updateNode);
  selection.selectAll(".link").call(updateLink);
};

// *****************************************************
// ** Graph and App components
// *****************************************************

class Graph extends React.Component {
  componentDidMount() {
    this.d3Graph = d3.select(ReactDOM.findDOMNode(this.refs.graph));
    force.on("tick", () => {
      // after force calculation starts, call updateGraph
      // which uses d3 to manipulate the attributes,
      // and React doesn't have to go through lifecycle on each tick
      this.d3Graph.call(updateGraph);
    });
  }

  shouldComponentUpdate(nextProps) {
    this.d3Graph = d3.select(ReactDOM.findDOMNode(this.refs.graph));

    const d3Nodes = this.d3Graph
      .selectAll(".node")
      .data(nextProps.nodes, (node) => node.key);
    d3Nodes.enter().append("g").call(enterNode);
    d3Nodes.exit().remove();
    d3Nodes.call(updateNode);

    const d3Links = this.d3Graph
      .selectAll(".link")
      .data(nextProps.links, (link) => link.key);
    d3Links.enter().insert("line", ".node").call(enterLink);
    d3Links.exit().remove();
    d3Links.call(updateLink);

    // we should actually clone the nodes and links
    // since we're not supposed to directly mutate
    // props passed in from parent, and d3's force function
    // mutates the nodes and links array directly
    // we're bypassing that here for sake of brevity in example
    force.nodes(nextProps.nodes).links(nextProps.links);
    force.start();

    return false;
  }

  render() {
    return (
      <svg width={width} height={height}>
        <g ref="graph" />
      </svg>
    );
  }
}

export class App extends React.Component {
  getInitialState() {
    return {
      nodes: [],
      links: [],
    };
  }

  componentDidMount() {
    this.updateData();
  }

  updateData() {
    // randomData is loaded in from external file generate_data.js
    // and returns an object with nodes and links
    const newState = randomData(this.state.nodes, width, height);
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <div className="update" onClick={this.updateData}>
          update
        </div>
        <Graph nodes={this.state.nodes} links={this.state.links} />
      </div>
    );
  }
}

//ReactDOM.render(<App />, document.getElementById("root"));
