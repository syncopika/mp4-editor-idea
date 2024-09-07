class Modal {
  constructor(){
    this.modalStyle = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: "1010",
      textAlign: "center",
      padding: "6px",
      backgroundColor: "#fff",
      width: "auto",
      height: "auto",
      boxShadow: "2px 2px 5px #ccc",
      border: "1px solid #ccc",
      overflowY: "auto",
    };
    
    this.modalOverlayStyle = {
      zIndex: "1000",
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "#aaa",
      opacity: "0.2",
    };
  }
  
  createMessageModal(textArray){
    const modal = document.createElement('div');
    modal.id = "modal";
    Object.assign(modal.style, this.modalStyle);
    
    for(const text of textArray){
      const displayText = document.createElement('p');
      displayText.textContent = text;
      modal.appendChild(displayText);
    }
    
    const okBtn = document.createElement('button');
    okBtn.innerText = "ok";
    modal.appendChild(okBtn);
    
    const modalOverlay = document.createElement('div');
    modalOverlay.id = "modal-overlay";
    Object.assign(modalOverlay.style, this.modalOverlayStyle);
    
    document.body.appendChild(modal);
    document.body.appendChild(modalOverlay);
    
    return new Promise(resolve => {
        okBtn.onclick = () => {
            resolve(true);
        };
    }).finally(() => {
        // make sure to close modal
        document.body.removeChild(modal);
        document.body.removeChild(modalOverlay);
    });
  }
}

// helpful! https://github.com/mdn/web-components-examples/blob/main/popup-info-box-web-component/main.js
class ModalComponent extends HTMLElement {
  constructor(){
    super();
  }
  
  connectedCallback(){
    //console.log("added to page");
    
    // shadow root
    const shadow = this.attachShadow({mode: "open"});
    
    // overlay div
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    
    // modal
    const modal = document.createElement("div");
    modal.className = "modal";
    
    // the area to display text
    const textArea = document.createElement("div");
    textArea.innerHTML = "<slot></slot>";
    
    // ok button
    const okBtn = document.createElement("button");
    okBtn.innerText = "ok";
    okBtn.addEventListener("click", () => {
      this.style.display = "none";
    });
    
    // set the style for shadow dom
    const style = document.createElement("style");
    style.textContent = `
      .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1010;
        text-align: center;
        padding: 6px;
        background-color: #fff;
        width: auto;
        height: auto;
        border: 1px solid #ccc;
        overflow-y: auto;
      }
    
      .modal-overlay {
        z-index: 1000;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backgroundColor: #aaa;
        opacity: 0.2;
      }
    `;
    
    // put it all together
    shadow.append(style);
    shadow.appendChild(overlay);
    shadow.appendChild(modal);
    modal.appendChild(textArea);
    modal.appendChild(okBtn);
  }
  
  disconnectedCallback(){
    console.log("removed from page");
  }
  
  adoptedCallback(){
    console.log("moved to new page");
  }
  
  attributeChangedCallback(name, oldVal, newVal){
    console.log("attribute changed");
  }
}

customElements.define("modal-component", ModalComponent);