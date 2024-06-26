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