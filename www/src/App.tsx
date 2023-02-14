
import './App.css';
import React from 'react';
interface  iProps{

}
interface  iState{
  currentModal: iModalOptions
}
interface iModalOptions {
  modalText?:string;
  modalTitle?: string;
  fields:  { [key: string]: iPrompt; };
}
interface iPrompt {
  name: string;
  value?: string;
}
class App extends React.Component<iProps, iState> {
  hasRendered: boolean;
  private mainCanvas: React.RefObject<HTMLCanvasElement>;
  private hiddenCanvas: React.RefObject<HTMLCanvasElement>;
  private modal: React.RefObject<HTMLDivElement>;
  
  constructor(props) {
    super(props);
    this.hasRendered = false;
    this.mainCanvas = React.createRef();
    this.hiddenCanvas = React.createRef();
    this.modal = React.createRef();
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.showModal({
      modalText: 'Describe your charecter',
      modalTitle: 'Who are you?',
      fields: {
        test1: {
          name:"Banans",
          value: ""
        },
        test2: {
          name:"Cheese",
          value: ""
        }
      }
    })
    if (this.hasRendered) {
      return;
    }

    this.hasRendered = true;

    this.mainCanvas.current.width = window.innerWidth;
    this.mainCanvas.current.height = window.innerHeight;
    const ctx = this.mainCanvas.current.getContext("2d")
    const hiddenCtx = this.hiddenCanvas.current.getContext("2d",  { willReadFrequently: true });
    const img = new Image();
    img.onload = ()=> {
      console.log("RENDERING");
      this.hiddenCanvas.current.width = img.width;
      this.hiddenCanvas.current.height = img.height;

      hiddenCtx.drawImage(img, 0,0, this.hiddenCanvas.current.width, this.hiddenCanvas.current.height);
      const baseRatio = img.height / img.width;
      const renderRatio = img.height / this.mainCanvas.current.height;
      const renderWidth = this.mainCanvas.current.height * baseRatio;
      const lPadding = (this.mainCanvas.current.width - renderWidth) / 2;


      /*let xRatio = img.width / this.mainCanvas.current.width;
      let yRatio = img.height / this.mainCanvas.current.height;*/
      for (let x = 0; x < this.mainCanvas.current.width; x++) {
        for (let y = 0; y < this.mainCanvas.current.height; y++) {
          let rX = Math.floor(x  * renderRatio);
          let rY = Math.floor(y * renderRatio);
          const c = hiddenCtx.getImageData(rX, rY, 1, 1);
          ctx.putImageData(c, lPadding + x, y);
        }
      }
      this.hiddenCanvas.current.width = img.width;
      this.hiddenCanvas.current.height = img.height;

    };
    img.src = 'test.png';
  }
  showModal(options: iModalOptions) {
    (window as any).$(this.modal.current).modal('show');
    this.setState({
      currentModal: options
    });
  }
  handleChange(event) {
    const state = this.state;
    state.currentModal.fields[event.target.id].value = event.target.value
    this.setState(state);
    console.log("handleChange", state);
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
                <ul className="navbar-nav">
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" id="themes">Items <span
                        className="caret"></span></a>
                    <div className="dropdown-menu" aria-labelledby="themes">
                      <a className="dropdown-item" href="#">Default</a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" href="#">Cerulean</a>

                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" id="themes">NPCs <span
                        className="caret"></span></a>
                    <div className="dropdown-menu" aria-labelledby="themes">
                      <a className="dropdown-item" href="#">Default</a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" href="#">Cerulean</a>

                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" id="themes">Missions <span
                        className="caret"></span></a>
                    <div className="dropdown-menu" aria-labelledby="themes">
                      <a className="dropdown-item" href="#">Default</a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" href="#">Cerulean</a>

                    </div>
                  </li>
                </ul>
              </div>
            </nav>
          </header>

          <main role="main">

            <canvas id="mainCanvas" height="100%" width="100%"  ref={this.mainCanvas}></canvas>
            <canvas id="hiddenCanvas" height="100%" width="100%"  ref={this.hiddenCanvas}></canvas>
            <div className="modal" id="myModal"  ref={this.modal}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <div className="modal-title">{this.state && this.state.currentModal.modalTitle}</div>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">x</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>{this.state && this.state.currentModal.modalText}</p>
                    {
                      this.state && this.state.currentModal && this.state.currentModal.fields && Object.keys(this.state.currentModal.fields).map((key, i) => {
                        return <div className="form-group">
                          <label className="col-form-label col-form-label-lg" htmlFor={ key }>
                            {this.state.currentModal.fields[key].name}
                          </label>
                          <input className="form-control form-control-sm" type="text"
                                 placeholder={this.state.currentModal.fields[key].name}
                                 aria-label={this.state.currentModal.fields[key].name}
                                 id={ key } onChange={this.handleChange}
                                 value={this.state.currentModal.fields[key].value}
                          />
                        </div>
                      })
                    }
                  </div>
                  <div className="modal-footer">
                    {/*<button type="button" className="btn btn-primary">Save changes</button>*/}
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.onNextClick}>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>


          <footer>

            <nav className="navbar navbar-expand-md navbar-dark fixed-bottom bg-dark">
              <div className="collapse navbar-collapse" id="navbarCollapse">
                <form className="form-inline mt-2 mt-md-0" action="#">
                  <input className="form-control mr-sm-2 form-control-lg" type="text" placeholder="Search" aria-label="Search"/>
                  <button className="btn btn-outline-success my-2 my-sm-0" type="submit" data-toggle="modal" data-target="#myModal">Try Action</button>
                </form>



              </div>
            </nav>

          </footer>

        </div>

    );
  }

  private onNextClick(e) {
    console.log('onNextClick', e);
  }
}
export default App;
