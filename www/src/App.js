import logo from './logo.svg';
import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.mainCanvas = React.createRef();
    this.hiddenCanvas = React.createRef();
  }
  componentDidMount() {
    const img = new Image();
    img.onload = ()=> {
      this.mainCanvas.current.width = window.innerWidth;
      this.mainCanvas.current.height = window.innerHeight;
      const ctx = this.mainCanvas.current.getContext("2d");
      const hiddenCtx = this.hiddenCanvas.current.getContext("2d");
      let xRatio = img.width / this.mainCanvas.current.width;
      let yRatio = img.height / this.mainCanvas.current.height;
      for (let x = 0; x < this.mainCanvas.current.width; x++) {
        for (let y = 0; y < this.mainCanvas.current.height; y++) {
          let rX = Math.floor(x  * xRatio);
          let rY = Math.floor(y * yRatio);
          const c = hiddenCtx.getImageData(rX, rY, 1, 1);
          ctx.putImageData(c, x, y);
        }
      }
      this.hiddenCanvas.current.width = img.width;
      this.hiddenCanvas.current.height = img.height;

      hiddenCtx.drawImage(img, 0,0, this.hiddenCanvas.current.width, this.hiddenCanvas.current.height);
    };
    img.src = 'test.png';
  }
  render() {
    return (
        <div>
          <header>
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
              <a className="navbar-brand" href="#">Chaos-ville</a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                      aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item active">
                    <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Link</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link disabled">Disabled</a>
                  </li>
                </ul>
              </div>
            </nav>
          </header>

          <main role="main">

            <canvas id="mainCanvas" height="100%" width="100%"  ref={this.mainCanvas}></canvas>
            <canvas id="hiddenCanvas" height="100%" width="100%"  ref={this.hiddenCanvas}></canvas>
          </main>


          <footer>
            <header>
              <nav className="navbar navbar-expand-md navbar-dark fixed-bottom bg-dark">
                <div className="collapse navbar-collapse" id="navbarCollapse">
                  <form className="form-inline mt-2 mt-md-0">
                    <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                  </form>
                </div>
              </nav>
            </header>
          </footer>

        </div>
    );
  }
}
export default App;
