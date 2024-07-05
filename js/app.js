

function toggle_dropdown(dropdown){
    dropdown.children[dropdown.children.length-1].classList.toggle('show-flex');
}


let link_toolbar = document.getElementById("link-container");
let selectedBox = document.getElementById("selected-box");
let rowSelectedBox = document.getElementById("row-selected-box");
let navBox = document.getElementById("nav-box");

let objects={}
let row_count = 0;
let col_count = 0;
let sub_count =0;
let current_col = "";
let current_row = "";
let current_sub = "";

let forcecol =false

let rowObjects=[]

let histrory =[],historyIndex=null,isUndo=false;

let target=null;

let selected = [],groupSelection=[];

let borderSIDE = "all";

let recursive_count ={'c':1,'r':1};

let selSPAN = null,selLINK =null,selText = null;

function add_row_t(){
  let prev_row = current_row;
  let row = new Row();
  row_count++;
  document.getElementsByClassName("post-table")[0].insertBefore(row.element, document.getElementById(prev_row));
  objects[row.element.id] = row;


}

function add_row_t_recursive(){

  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  for(let i=0;i<recursive_count['r'];i++){
    add_row_t();
  }
  document.getElementById("add-row").value=1;
  recursive_count['r'] =1;
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;

}
function add_row() {


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  let row = new Row();
  row_count++;
  document.getElementsByClassName("post-table")[0].appendChild(row.element);
  objects[row.element.id] = row;


  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function add_row_b(){
  let prev_row = current_row;
  let row = new Row();
  row_count++;
  document.getElementsByClassName("post-table")[0].insertBefore(row.element, document.getElementById(prev_row).nextSibling);
  objects[row.element.id] = row;



}

function add_row_b_recursive(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  for(let i=0;i<recursive_count['r'];i++){
    add_row_b();
  }
  document.getElementById("add-row").value=1;
  recursive_count['r'] =1;


  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function add_row_recursive(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  for(let i=0;i<recursive_count['r'];i++){
    add_row();
  }
  document.getElementById("add-row").value=1;
  recursive_count['r'] =1;
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function add_col_l(){
  let prev_col = current_col
  let col = new Column();
  col.element.addEventListener("click", handleSelection);
  col_count++;
  let cols =objects[current_row].columns;
  let ncols=[];
  for(let i=0;i<cols.length;i++){
    if(cols[i] === prev_col){
      ncols.push(col.element.id);
    }
    ncols.push(cols[i]);
  }
  objects[current_col]=col;
  objects[current_row].columns=ncols;
  let el =document.getElementById(prev_col);
  objects[current_row].element.insertBefore(col.element, el);
  objects[col.element.id] = col;
  objects[col.element.id].element.addEventListener("mouseup", saveSelection);
  objects[col.element.id].element.focus()


}

function add_col_l_recurse(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  for(let i=0;i<recursive_count['c'];i++){
    add_col_l();
  }
  document.getElementById("add-column").value=1;
  recursive_count['c'] =1;
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function add_col() {
  let col = new Column();
  col.element.addEventListener("click", handleSelection)
  col_count++;
  objects[current_row].columns.push(col.element.id);
  objects[current_col] = col;
  objects[current_row].element.insertBefore(col.element, objects[current_row].add_btn);
  objects[col.element.id] = col;
  objects[col.element.id].element.focus()
  objects[col.element.id].element.addEventListener("mouseup", saveSelection);

}

function add_col_r(){
  let prev_col = current_col
  let col = new Column();
  col.element.addEventListener("click", handleSelection)
  col_count++;
  let cols =objects[current_row].columns;
  let ncols=[];
  for(let i=0;i<cols.length;i++){
    ncols.push(cols[i]);
    if(cols[i] === prev_col){
      ncols.push(col.element.id);
    }
  }
  objects[current_row].columns=ncols;
  objects[current_col]=col;
  let el =document.getElementById(prev_col);
  if(el.nextSibling.classList.contains("resize")){
    el =el.nextSibling
  }
  objects[current_row].element.insertBefore(col.element, el.nextSibling);
  objects[col.element.id] = col;
  objects[col.element.id].element.addEventListener("mouseup", saveSelection);
  objects[col.element.id].element.focus()


}

async function add_col_r_recurse(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  for(let i=0;i<recursive_count['c'];i++){
    await add_col_r();
  }
  document.getElementById("add-column").value=1;
  recursive_count['c'] =1;
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function set_fontsize(size) {


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(selected.length > 0) {
    for(let i=0;i<selected.length;i++){
      let col = document.getElementById(selected[i]);
      col.style.fontSize = size;
    }


  }else if(selText !== null){
    selText.style.fontSize = size;
  }
  else {
    console.log(selSPAN)
    let temp = document.createElement("div");
    temp.appendChild(savedSelection.cloneContents());

    if (savedSelection && selSPAN === null && temp.innerHTML !== "") {
      let span = document.createElement("span");
      span.style.fontSize = size;
      if (temp.children.length === 0) {
        span.appendChild(savedSelection.extractContents());
      } else {
        temp.children[0].style.fontSize = size;
        span = temp.children[0]
        console.log(span);
      }
      savedSelection.deleteContents();
      savedSelection.insertNode(span);


    } else if (selSPAN !== null) {
      selSPAN.style.fontSize = size;

    } else {
      if(current_sub !== ""){
        document.getElementById(current_sub).style.fontSize = size;
      }else {
        document.getElementById(current_col).style.fontSize = size;
      }
    }
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}


function set_height(size) {


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(selected.length > 0) {
    for(let i=0;i<selected.length;i++){
      let col = document.getElementById(selected[i]);
      col.style.lineHeight = size;
    }


  }else if(selText !== null){
    selText.style.lineHeight = size;
  }
  else {
    console.log(selSPAN)
    let temp = document.createElement("div");
    temp.appendChild(savedSelection.cloneContents());

    if (savedSelection && selSPAN === null && temp.innerHTML !== "") {
      let span = document.createElement("span");
      span.style.lineHeight = size;
      if (temp.children.length === 0) {
        span.appendChild(savedSelection.extractContents());
      } else {
        temp.children[0].style.fontSize = size;
        span = temp.children[0]
        console.log(span);
      }
      savedSelection.deleteContents();
      savedSelection.insertNode(span);


    } else if (selSPAN !== null) {
      selSPAN.style.lineHeight = size;

    } else {
      if(current_sub !== ""){
        document.getElementById(current_sub).style.lineHeight = size;
      }else {
        document.getElementById(current_col).style.lineHeight = size;
      }
    }
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}


function set_fontcolor(color) {


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(selected.length > 0) {
    for(let i=0;i<selected.length;i++){
      let col = document.getElementById(selected[i]);
      col.style.color = color;
    }



}else if(selText !== null) {
    selText.style.color = color;

}else {
    let temp = document.createElement("div");
    temp.appendChild(savedSelection.cloneContents());
    console.log(selSPAN);

    if (savedSelection && selSPAN === null && temp.innerHTML !== "") {
      let span = document.createElement("span");
      span.style.color = color;
      if (temp.children.length === 0) {
        span.appendChild(savedSelection.extractContents());
      } else {
        temp.children[0].style.color = color;
        span = temp.children[0]
        console.log(span);
      }
      savedSelection.deleteContents();
      savedSelection.insertNode(span);

      savedSelection = null;


    } else if (selSPAN !== null) {
      selSPAN.style.color = color;

    } else {

      if(current_sub !== ""){
        document.getElementById(current_sub).style.color = color;
      }else {
        document.getElementById(current_col).style.color = color;
      }
    }
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function set_highlightcolor(color) {


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);


  let temp = document.createElement("div");
  temp.appendChild(savedSelection.cloneContents());

  if(savedSelection && selSPAN === null && temp.innerHTML !=="" ) {
    let span = document.createElement("span");
    span.style.backgroundColor = color;
    if (temp.children.length === 0) {
      span.appendChild(savedSelection.extractContents());
    } else {
      temp.children[0].style.backgroundColor = color;
      span = temp.children[0]
    }
    console.log(span);
    savedSelection.deleteContents();
    savedSelection.insertNode(span);
    savedSelection = null;


  }else if(selSPAN !== null){
    selSPAN.style.backgroundColor = color;

  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function set_bold() {


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if (selected.length > 0) {
    for (let i = 0; i < selected.length; i++) {
      let col = document.getElementById(selected[i]);
      if (col.style.fontWeight !== "bold") {
        col.style.fontWeight = "bold";
      } else {
        col.style.fontWeight = "normal";
      }
    }



  }else if(selText !== null) {
    if (selText.style.fontWeight !== "bold") {
      selText.style.fontWeight = "bold";
    } else {
      selText.style.fontWeight = "normal";
    }
  }else
  {
    let temp = document.createElement("div");
    temp.appendChild(savedSelection.cloneContents());

    if (savedSelection && selSPAN === null && temp.innerHTML !== "") {
      let span = document.createElement("span");
      span.style.fontWeight = "bold";
      if (temp.children.length === 0) {
        span.appendChild(savedSelection.extractContents());
      } else {

        if (temp.children[0].style.fontWeight !== "bold") {
          temp.children[0].style.fontWeight = "bold";
        } else {
          temp.children[0].style.fontWeight = "normal";
        }

        span = temp.children[0]
      }
      savedSelection.deleteContents();
      savedSelection.insertNode(span);
      savedSelection = null;
    } else if (selSPAN !== null) {
      if (selSPAN.style.fontWeight !== "bold") {
        selSPAN.style.fontWeight = "bold";
      } else {
        selSPAN.style.fontWeight = "normal";
      }

    } else {
      if(current_sub !== ""){
        if (document.getElementById(current_sub).style.fontWeight !== "bold") {
          document.getElementById(current_sub).style.fontWeight = "bold";
        } else {
          document.getElementById(current_sub).style.fontWeight = "normal";
        }
      }else {
        if (document.getElementById(current_col).style.fontWeight !== "bold") {
          document.getElementById(current_col).style.fontWeight = "bold";
        } else {
          document.getElementById(current_col).style.fontWeight = "normal";
        }
      }

    }
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function set_italic() {


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);


  if(selected.length > 0) {
    for(let i=0;i<selected.length;i++){
      let col = document.getElementById(selected[i]);
      if (col.style.fontStyle !== "italic") {
        col.style.fontStyle = "italic";
      } else {
        col.style.fontStyle = "normal";
      }
    }


  }else if ( selText !== null) {
    if (selText.style.fontStyle !== "italic") {
      selText.style.fontStyle = "italic";
    } else {
      selText.style.fontStyle = "normal";
    }
  }else
   {

    let temp = document.createElement("div");
    temp.appendChild(savedSelection.cloneContents());

    if (savedSelection && selSPAN === null && temp.innerHTML !== "") {
      let span = document.createElement("span");
      span.style.fontStyle = "italic";
      if (temp.children.length === 0) {
        span.appendChild(savedSelection.extractContents());
      } else {

        if (temp.children[0].style.fontStyle !== "italic") {
          temp.children[0].style.fontStyle = "italic";
        } else {
          temp.children[0].style.fontStyle = "normal";
        }

        span = temp.children[0]
      }
      savedSelection.deleteContents();
      savedSelection.insertNode(span);
      savedSelection = null;
    } else if (selSPAN !== null) {
      if (selSPAN.style.fontStyle !== "italic") {
        selSPAN.style.fontStyle = "italic";
      } else {
        selSPAN.style.fontStyle = "normal";
      }

    } else {
      if(current_sub !== ""){
        if (document.getElementById(current_sub).style.fontStyle !== "italic") {
          document.getElementById(current_sub).style.fontStyle = "italic";
        } else {
          document.getElementById(current_sub).style.fontStyle = "normal";
        }
      }else {
        if (document.getElementById(current_col).style.fontStyle !== "italic") {
          document.getElementById(current_col).style.fontStyle = "italic";
        } else {
          document.getElementById(current_col).style.fontStyle = "normal";
        }
      }
    }
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;

}

function set_underline() {


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(selected.length > 0) {
    for(let i=0;i<selected.length;i++){
      let col = document.getElementById(selected[i]);
      if (col.style.textDecoration !== "underline") {
        col.style.textDecoration = "underline";
      } else {
        col.style.textDecoration = "none";
      }
    }



  }else if(selText !== null) {
    if (selText.style.textDecoration !== "underline") {
      selText.style.textDecoration = "underline";
    } else {
      selText.style.textDecoration = "none";
    }

  }else{
    let temp = document.createElement("div");
    temp.appendChild(savedSelection.cloneContents());

    if (savedSelection && selSPAN === null && temp.innerHTML !== "") {
      let span = document.createElement("span");
      span.style.textDecoration = "underline";
      if (temp.children.length === 0) {
        span.appendChild(savedSelection.extractContents());
      } else {

        if (temp.children[0].style.textDecoration !== "underline") {
          temp.children[0].style.textDecoration = "underline";
        } else {
          temp.children[0].style.textDecoration = "none";
        }

        span = temp.children[0]
      }
      savedSelection.deleteContents();
      savedSelection.insertNode(span);
      savedSelection = null;
    } else if (selSPAN !== null) {
      if (selSPAN.style.textDecoration !== "underline") {
        selSPAN.style.textDecoration = "underline";
      } else {
        selSPAN.style.textDecoration = "none";
      }

    } else {

      if(current_sub !== ""){
        if (document.getElementById(current_sub).style.textDecoration !== "underline") {
          document.getElementById(current_sub).style.textDecoration = "underline";
        } else {
          document.getElementById(current_sub).style.textDecoration = "none";
        }
      }else {
        if (document.getElementById(current_col).style.textDecoration !== "underline") {
          document.getElementById(current_col).style.textDecoration = "underline";
        } else {
          document.getElementById(current_col).style.textDecoration = "none";
        }
      }

    }
  }

  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;

}

function clear_Highlight() {


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(selSPAN !== null) {
    selSPAN.style.backgroundColor = "transparent";
  }


  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function set_align(align) {


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(selected.length > 0) {
    for(let i=0;i<selected.length;i++){
      let col = document.getElementById(selected[i]);
      col.style.textAlign = align;
    }


  }else {
    if(current_sub !== ""){
      document.getElementById(current_sub).style.textAlign = align;
    }else {
      document.getElementById(current_col).style.textAlign = align;
    }
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function set_content(align){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(selected.length > 0) {
    for(let i=0;i<selected.length;i++){
      let col = document.getElementById(selected[i]);
      col.style.alignContent = align;
    }


  }else {
    if (current_sub !== "") {
      document.getElementById(current_sub).style.alignContent = align;
    } else {
      document.getElementById(current_col).style.alignContent = align;
    }
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function setUnorderedList() {


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  let ul = document.createElement("ul");
  let li =document.createElement("li")
  li.innerText="Unordered List"
  ul.appendChild(li)
  document.getElementById(current_col).appendChild(ul);
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function setOrderedList() {


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  let ul = document.createElement("ol");
  let li =document.createElement("li")
  li.innerText="Ordered List"
  ul.appendChild(li)
  if (current_sub !== "") {
    document.getElementById(current_sub).appendChild(ul);
  } else {
    document.getElementById(current_col).appendChild(ul);
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function set_link() {


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  let link = document.createElement("a");
  link.href = "#";
  link.target = "_blank";
  link.innerText = "Link";
  if(savedSelection){
    savedSelection.deleteContents();
    savedSelection.insertNode(link);
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function set_linkText(text){
  selLINK.innerText = text;

}

function set_linkURL(url){
  selLINK.href = url;
}

function set_bgcolor(color){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(selected.length > 0) {
    for(let i=0;i<selected.length;i++){
      let col = document.getElementById(selected[i]);
      col.style.backgroundColor = color;
    }


  }else {
    if(current_sub !== ""){
      document.getElementById(current_sub).style.backgroundColor = color;
    }else {
      document.getElementById(current_col).style.backgroundColor = color;
    }
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function changeTag(element, newTag) {


  // Create a new element with the desired tag name
  let newElement = document.createElement(newTag);

  // Copy the attributes of the old element to the new one
  for (let i = 0; i < element.attributes.length; i++) {
    newElement.setAttribute(element.attributes[i].name, element.attributes[i].value);
  }

  // Copy the children of the old element to the new one
  while (element.firstChild) {
    newElement.appendChild(element.firstChild);
  }

  // Replace the old element with the new one
  element.parentNode.replaceChild(newElement, element);

  return newElement;
}


function set_para(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  let temp = document.createElement("div");
  temp.appendChild(savedSelection.cloneContents());


  if(savedSelection&& temp.innerHTML !== "") {
    let span = document.createElement("p");
      span.appendChild(savedSelection.extractContents());
    savedSelection.deleteContents();
    savedSelection.insertNode(span);
    savedSelection = null;


  }else {
    if (selText === null) {
      let p = document.createElement("p");
      p.innerText = "Paragraph";
      if(current_sub !== ""){
        document.getElementById(current_sub).appendChild(p);

      }else {
        document.getElementById(current_col).appendChild(p);
      }
    } else {
      selText = changeTag(selText, 'p');

    }
  }
  document.getElementById("p-btn").classList.toggle("active", false);
  document.getElementById("h1-btn").classList.toggle("active", false);
  document.getElementById("h2-btn").classList.toggle("active", false);
  document.getElementById("h3-btn").classList.toggle("active", false);
  document.getElementById("h4-btn").classList.toggle("active", false);

  document.getElementById("p-btn").classList.toggle("active", true);
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function set_h1(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  let temp = document.createElement("div");
  temp.appendChild(savedSelection.cloneContents());


  if(savedSelection&& temp.innerHTML !== "") {
    let span = document.createElement("h1");
    span.appendChild(savedSelection.extractContents());
    savedSelection.deleteContents();
    savedSelection.insertNode(span);
    savedSelection = null;
  }else {
    if (selText === null) {
      let h1 = document.createElement("h1");
      h1.innerText = "Heading 1";
      if(current_sub !== ""){
        document.getElementById(current_sub).appendChild(h1);
      }else {
        document.getElementById(current_col).appendChild(h1);
      }
    } else {
      selText = changeTag(selText, 'h1');

    }
  }
  document.getElementById("p-btn").classList.toggle("active", false);
  document.getElementById("h1-btn").classList.toggle("active", false);
  document.getElementById("h2-btn").classList.toggle("active", false);
  document.getElementById("h3-btn").classList.toggle("active", false);
  document.getElementById("h4-btn").classList.toggle("active", false);

  document.getElementById("h1-btn").classList.toggle("active", true);
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;

}


function set_h2(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  let temp = document.createElement("div");
  temp.appendChild(savedSelection.cloneContents());


  if(savedSelection&& temp.innerHTML !== "") {
    let span = document.createElement("h2");
    span.appendChild(savedSelection.extractContents());
    savedSelection.deleteContents();
    savedSelection.insertNode(span);
    savedSelection = null;
  }else {
    if (selText === null) {
      let h2 = document.createElement("h2");
      h2.innerText = "Heading 2";
      if(current_sub !== ""){
        document.getElementById(current_sub).appendChild(h2);
      }else {
        document.getElementById(current_col).appendChild(h2);
      }
    } else {
      selText = changeTag(selText, 'h2');

    }
  }
  document.getElementById("p-btn").classList.toggle("active", false);
  document.getElementById("h1-btn").classList.toggle("active", false);
  document.getElementById("h2-btn").classList.toggle("active", false);
  document.getElementById("h3-btn").classList.toggle("active", false);
  document.getElementById("h4-btn").classList.toggle("active", false);

  document.getElementById("h2-btn").classList.toggle("active", true);
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;

}


function set_h3(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  let temp = document.createElement("div");
  temp.appendChild(savedSelection.cloneContents());


  if(savedSelection&& temp.innerHTML !== "") {
    let span = document.createElement("h3");
    span.appendChild(savedSelection.extractContents());
    savedSelection.deleteContents();
    savedSelection.insertNode(span);
    savedSelection = null;  }else {
    if (selText === null) {
      let h3 = document.createElement("h3");
      h3.innerText = "Heading 3";
      if(current_sub !== ""){
        document.getElementById(current_sub).appendChild(h3);
      }else {
        document.getElementById(current_col).appendChild(h3);
      }
    } else {
      selText = changeTag(selText, 'h3');

    }
  }
  document.getElementById("p-btn").classList.toggle("active", false);
  document.getElementById("h1-btn").classList.toggle("active", false);
  document.getElementById("h2-btn").classList.toggle("active", false);
  document.getElementById("h3-btn").classList.toggle("active", false);
  document.getElementById("h4-btn").classList.toggle("active", false);

  document.getElementById("h3-btn").classList.toggle("active", true);
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;

}


function set_h4(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  let temp = document.createElement("div");
  temp.appendChild(savedSelection.cloneContents());


  if(savedSelection&& temp.innerHTML !== "") {
    let span = document.createElement("h4");
    span.appendChild(savedSelection.extractContents());
    savedSelection.deleteContents();
    savedSelection.insertNode(span);
    savedSelection = null;


  }else {
    if (selText === null) {
      let h4 = document.createElement("h4");
      h4.innerText = "Heading 4";
      if(current_sub !== ""){
        document.getElementById(current_sub).appendChild(h4);
      }else {
        document.getElementById(current_col).appendChild(h4);
      }
    } else {
      selText = changeTag(selText, 'h4');

    }
  }
  document.getElementById("p-btn").classList.toggle("active", false);
  document.getElementById("h1-btn").classList.toggle("active", false);
  document.getElementById("h2-btn").classList.toggle("active", false);
  document.getElementById("h3-btn").classList.toggle("active", false);
  document.getElementById("h4-btn").classList.toggle("active", false);

  document.getElementById("h4-btn").classList.toggle("active", true);
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;

}

function set_recursive(key,value){
  if(value === ''){
    value=1;
  }else{
    value =parseInt(value)

  }
  recursive_count[key] = value;

}

function set_col_width(width){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(width === "" || width === "0"){
    width = "auto";
  }
  if(selected.length > 0) {
    for(let i=0;i<selected.length;i++){
      let col = document.getElementById(selected[i]);
      col.style.width = width;
    }


  }else {

    if(current_sub !== "" && !forcecol ) {
      document.getElementById(current_sub).style.width = width;
    }else {
      document.getElementById(current_col).style.width = width;
    }
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}


function set_padding(padding){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(selected.length > 0) {
    for(let i=0;i<selected.length;i++){
      let col = document.getElementById(selected[i]);
      col.style.padding = padding;
    }
  }else{
    if(current_sub !== "" && objects[current_sub].element.classList.contains("post-sub") && objects[current_sub].element.classList.contains("post-column") ) {
      document.getElementById(current_sub).style.padding = padding;
    }else {
      document.getElementById(current_col).style.padding = padding;
    }
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function set_row_height(height){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(height === "" || height === "0"){
    height = "auto";
  }
  if(selected.length > 0) {
    for(let i=0;i<selected.length;i++){
      let row = document.getElementById(selected[i]).parentElement;
      row.style.height = height;
    }
  }else {
    if(current_sub !== ""  && !forcecol) {
      document.getElementById(current_sub).style.height = height;
    }else {
      document.getElementById(current_row).style.height = height;
    }
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;

}

function update_view(){
  let row = document.getElementById(current_row);
  let cols = objects[current_row].columns;
  row.innerHTML = '';
  for(let i=0;i<cols.length;i++){
    row.appendChild(objects[cols[i]].element);
  }
}

function move_col_left(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  let cols =objects[current_row].columns;
  let ncols=[];
  for(let i=0;i<cols.length;i++){
    if(cols[i+1] === current_col){
      ncols.push(cols[i+1]);
      ncols.push(cols[i]);
      i++;
    }else{
      ncols.push(cols[i]);
    }
  }
  objects[current_row].columns=ncols;
  console.log(objects[current_row].columns);
  update_view()
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;
}

function move_col_right(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  let cols =objects[current_row].columns;
  let ncols=[];
  for(let i=0;i<cols.length;i++){
    if(cols[i] === current_col){
      ncols.push(cols[i+1]);
      ncols.push(cols[i]);
      i++;
    }else{
      ncols.push(cols[i]);
    }
  }
  objects[current_row].columns=ncols;
  update_view()
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;

}

function delete_col(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(selected.length > 0) {
    for(let i=0;i<selected.length;i++){
      try {
        let col = document.getElementById(selected[i]);
        let row = col.parentElement;
        let cols = objects[row.id].columns;
        let ncols = [];
        for (let i = 0; i < cols.length; i++) {
          if (cols[i] !== col.id) {
            ncols.push(cols[i]);
          }
        }
        objects[row.id].columns = ncols;
        col.remove();
        delete objects[col.id];
      }catch (e){
        console.log(e);
      }
    }
    selected = [];
    selectedBox.classList.add("hidden");
    current_col="";
    return;
  }
  if(current_sub !== "" && objects[current_sub].element.classList.contains("post-sub") && objects[current_sub].element.classList.contains("post-column") ) {
    let parent =objects[current_sub].element.parentElement.id;
    let cols = objects[parent].subs;
    let ncols = [];
    for (let i = 0; i < cols.length; i++) {
      if (cols[i] !== current_sub) {
        ncols.push(cols[i]);
      }
    }
    objects[objects[current_sub].element.parentElement.id].subs = ncols;
    objects[current_sub].element.remove();
    delete objects[current_sub];
    if(ncols.length ===0){
      objects[parent].element.contentEditable= true;
      objects[parent].element.style.padding="";
    }
    current_sub = "";

  }else{

  let cols = objects[current_row].columns;
  let ncols = [];
  for (let i = 0; i < cols.length; i++) {
    if (cols[i] !== current_col) {
      ncols.push(cols[i]);
    }
  }
  objects[current_row].columns = ncols;
  objects[current_col].element.remove();
  delete objects[current_col];
  }
  current_col="";
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);


  historyIndex = histrory.length-1;
}

function delete_row(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(selected.length > 0) {
    for(let i=0;i<selected.length;i++){
      try {
        let row = document.getElementById(selected[i]).parentElement;
        row.remove();
        delete objects[row.id];
      }catch (e){
        console.log(e);
      }
    }
    selected = [];
    selectedBox.classList.add("hidden");
    current_col="";
    current_row="";
    return;
  }

  if(current_sub !== "" && objects[current_sub].element.classList.contains("post-sub") && objects[current_sub].element.classList.contains("post-row") ) {
    let sub =objects[objects[current_sub].element.parentElement.id]
    let cols = sub.subs;
    let ncols = [];
    for (let i = 0; i < cols.length; i++) {
      if (cols[i] !== current_sub) {
        ncols.push(cols[i]);
      }
    }
    objects[objects[current_sub].element.parentElement.id].subs = ncols;
    objects[current_sub].element.remove();
    delete objects[current_sub];
    current_sub = "";
    if(ncols.length ===0){
      objects[parent].element.contentEditable= true;
      objects[parent].element.style.padding="";
    }

  }else{
    objects[current_row].element.remove();
    delete objects[current_row];
  }
  current_col="";
  current_row="";
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);


  historyIndex = histrory.length-1;
}

function set_border_side(side){
  borderSIDE = side.toLowerCase();
  document.getElementById("border-side").innerText = side;
}

function  move_row_a(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  let rows = document.getElementsByClassName("post-row");
  let nrows = [];
  console.log(current_row);
  for(let i=0;i<rows.length;i++){
    if(rows[i].id === current_row){
      nrows.push(rows[i]);
      nrows.push(rows[i-1]);
      i++;
    }else{
      nrows.push(rows[i]);
    }
  }
  document.getElementsByClassName("post-table")[0].innerHTML = '';
  for(let i=0;i<nrows.length;i++){
    document.getElementsByClassName("post-table")[0].appendChild(objects[nrows[i].id].element);
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;

}

function  move_row_b(){


  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  let rows = document.getElementsByClassName("post-row");
  let nrows = [];
  for(let i=0;i<rows.length;i++){
    if(rows[i].id === current_row){
      nrows.push(rows[i+1]);
      nrows.push(rows[i]);
      i++;
    }else{
      nrows.push(rows[i]);
    }
  }
  document.getElementsByClassName("post-table")[0].innerHTML = '';
  for(let i=0;i<nrows.length;i++){
    document.getElementsByClassName("post-table")[0].appendChild(objects[nrows[i].id].element);
  }

  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  historyIndex = histrory.length-1;

}

function add_border(){
  let el = document.getElementById(current_col);
  if(borderSIDE === "all"){
    el.style.border = "1px solid black";
  }else{
    el.style["border"+borderSIDE.charAt(0).toUpperCase()+borderSIDE.slice(1)] = "1px solid black";
  }

}

function rem_border(){
  let el = document.getElementById(current_col);
  if(borderSIDE === "all"){
    el.style.border = "none";
  }else{
    el.style["border"+borderSIDE.charAt(0).toUpperCase()+borderSIDE.slice(1)] = "none";
  }


}

function fix_border(){
  let rows = document.getElementsByClassName("post-row");
  for(let i=0;i<rows.length;i++){
    let cols = rows[i].children;
    let isBottom = true;
    if((rows[i+1] !== null && rows[i+1].classList.contains("post-row")) || (rows[i+2] !== null && rows[i+2].classList.contains("post-row"))){
      isBottom= false;
    }
    for(let j=0;j<cols.length;j++){
      if(cols[j].classList.contains("post-column")){
        cols[j].style.border = "1px solid black";
        if((cols[j+1] !== null && cols[j+1].classList.contains("post-column")) || (cols[j+2] !== null && cols[j+2].classList.contains("post-column"))){
          cols[j].style.borderRight = "none";
        }

        if(!isBottom){
          cols[j].style.borderBottom = "none";
        }

      }
    }
  }
}

function splitVer(){
  let col = objects[current_col];
  if(current_sub !== ""){
    col = objects[current_sub];
  }
  col.element.classList.add("sub-col");
  col.element.contentEditable = false;
  col.element.style.padding = '0';

  let subcol = new SubColumn()
  objects[subcol.element.id] = subcol;
  let subcols = [subcol.element.id];
  let subs = col.subs;
  if(subs.length> 0){
    subcols.push(objects[subs[0]].element.id);
  }else{
    let newsubcol = new SubColumn()
    objects[newsubcol.element.id] = newsubcol;
    subcols.push(newsubcol.element.id);
  }
  col.subs = col.subs.concat(subcols);
  col.element.innerHTML = '';
  for (let i = 0; i < col.subs.length; i++) {
    col.element.appendChild(objects[col.subs[i]].element);
  }


}

function splitHor(){
  let col = objects[current_col];
  if(current_sub !== ""){
    col = objects[current_sub];
  }
  col.element.classList.add("sub-row");
  col.element.contentEditable = false;
  col.element.style.padding = '0';

  let subcol = new SubRow()
  objects[subcol.element.id] = subcol;
  col.element.appendChild(subcol.element);
  let subcols = [subcol.element.id];
  let subs = col.subs;
  if(subs.length> 0){
    subcols.push(objects[subs[0]].element.id);
  }else{
    let newsubcol = new SubRow()
    objects[newsubcol.element.id] = newsubcol;
    subcols.push(newsubcol.element.id);
    col.element.appendChild(newsubcol.element);
  }
  col.subs = col.subs.concat(subcols);
  col.element.innerHTML = '';
  for (let i = 0; i < col.subs.length; i++) {
    col.element.appendChild(objects[col.subs[i]].element);
  }


}


class SubRow {
  constructor() {
    this.subs=[];
    this.columns = [];
    this.element = document.createElement("td");
    this.element.contentEditable = true;
    this.element.id = "sr-" + sub_count;
    this.element.classList.add("post-row");
    this.element.classList.add("post-sub");
    current_sub = this.element.id;
    sub_count++;
  }
}

class SubColumn {
  constructor() {
    this.subs=[];
    this.element = document.createElement("td");
    this.element.contentEditable = true;
    this.element.classList.add("post-column");
    this.element.classList.add("post-sub");
    this.element.id = "sc-" + sub_count;
    current_sub = this.element.id;
    sub_count++;
  }
}

class Row {
  constructor() {
    this.columns = [];
    this.element = document.createElement("tr");
    this.element.id = "r-" + row_count;
    current_row = this.element.id;
    this.element.classList.add("post-row");
    this.sel_btn = document.createElement("div");
    this.sel_btn.classList.add("btn");
    this.sel_btn.innerHTML = "<i class=\"fas fa-arrow-alt-right\"></i>";
    this.add_btn = document.createElement("div");
    this.add_btn.classList.add("add-btn");
    this.add_btn.innerHTML = "<i class=\"fas fa-plus\"></i>";
    this.add_btn.addEventListener("click", () => {
      current_row = this.element.id;
      add_col(this.element.id);
    });
    this.sel_btn.addEventListener("click",handelSelectRow);
    this.element.appendChild(this.sel_btn);
    this.element.appendChild(this.add_btn);
  }
}

class Column {
  constructor() {
    this.subs=[];
    this.element = document.createElement("td");
    this.element.contentEditable = true;
    this.element.classList.add("post-column");
    this.element.id = "c-" + col_count;
    current_col = this.element.id;
  }
}


function toggle_propertyBox(){
  document.getElementById("property-box").classList.toggle("prop-hide");


}


const componentToHex = (c) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};
const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

function loadStyle(el){

  if(el === null){
    el = target;
  }
  if(el !==null && el !==undefined){

    if(el.classList.contains("post-row") && el.classList.contains("post-sub")){
      document.getElementById("delete-row-type").innerText= "Delete Sub Row";
    }else{
      document.getElementById("delete-row-type").innerText= "Delete Row";
    }
    if(el.classList.contains("post-column") && el.classList.contains("post-sub")){
      document.getElementById("delete-col-type").innerText= "Delete Sub Column";
    }
    else{
      document.getElementById("delete-col-type").innerText= "Delete Column";
    }
    if(el.classList.contains("post-sub")){
      document.getElementById("row-type").innerText= "Sub Row";
      document.getElementById("column-type").innerText= "Sub Column";
    }else{
      document.getElementById("row-type").innerText= "Row";
      document.getElementById("column-type").innerText= "Column";
    }


    document.getElementById("fontsize_input").value = document.defaultView.getComputedStyle(el).fontSize;
    let color = document.defaultView.getComputedStyle(el).color;
    if (!color.includes("#")) {
      color = color.split("(")[1].replace(")", "").split(",");
      color = rgbToHex(
        parseInt(color[0]),
        parseInt(color[1]),
        parseInt(color[2])
      );
    }
    document.getElementById("color-picker").value = color;
    let bgcolor = document.defaultView.getComputedStyle(el).backgroundColor;
    if (!bgcolor.includes("#")) {
      bgcolor = bgcolor.split("(")[1].replace(")", "").split(",");
      bgcolor = rgbToHex(
        parseInt(bgcolor[0]),
        parseInt(bgcolor[1]),
        parseInt(bgcolor[2])
      );
    }
    document.getElementById("highlight-color-picker").value = bgcolor;
    document.getElementById("column-width").value = document.defaultView.getComputedStyle(el).width;
    document.getElementById("row-height").value = document.defaultView.getComputedStyle(document.getElementById(current_row)).height;
    document.getElementById("padding").value = document.getElementById(current_col).style.padding;
    document.getElementById("line-height").value = document.defaultView.getComputedStyle(el).lineHeight;

    document.getElementById("span-column").value = document.getElementById(current_col).colSpan;
    document.getElementById("span-row").value = document.getElementById(current_col).rowSpan;

    let boldBTN =document.getElementById('bold-btn')
    let isBold = false;
    let italicBTN =document.getElementById('italic-btn')
    let isItalic = false;
    let underlineBTN =document.getElementById('underline-btn')
    let isUnderline = false;
    let HRAlign = document.getElementById("h-right-btn");
    let HCAlign = document.getElementById("h-center-btn");
    let HLAlign = document.getElementById("h-left-btn");
    let isHBTN =[false,false,false];
    let VTopAlign = document.getElementById("v-start-btn");
    let VCenterAlign = document.getElementById("v-center-btn");
    let VBottomAlign = document.getElementById("v-bottom-btn");
    let isVBTN =[false,false,false];
    if(el.style.fontWeight === "bold"){
      isBold = true;
    }
    boldBTN.classList.toggle("active", isBold);
    if(el.style.fontStyle === "italic"){
      isItalic = true;
    }
    italicBTN.classList.toggle("active", isItalic);
    if(el.style.textDecoration === "underline"){
      isUnderline = true;
    }
    underlineBTN.classList.toggle("active", isUnderline);
    if(el.style.textAlign === "right") {
      isHBTN[0] = true;
    }else if(el.style.textAlign === "center") {
      isHBTN[1] = true;
    }else if(el.style.textAlign === "left") {
      isHBTN[2] = true;
    }
    HRAlign.classList.toggle("active", isHBTN[0]);
    HCAlign.classList.toggle("active", isHBTN[1]);
    HLAlign.classList.toggle("active", isHBTN[2]);
    if(el.style.alignContent === "start") {
      isVBTN[0] = true;
    }else if(el.style.alignContent === "center") {
      isVBTN[1] = true;
    }else if(el.style.alignContent === "end") {
      isVBTN[2] = true;
    }
    VTopAlign.classList.toggle("active", isVBTN[0]);
    VCenterAlign.classList.toggle("active", isVBTN[1]);
    VBottomAlign.classList.toggle("active", isVBTN[2]);

    if(selText !== null){
      document.getElementById("p-btn").classList.toggle("active", false);
      document.getElementById("h1-btn").classList.toggle("active", false);
      document.getElementById("h2-btn").classList.toggle("active", false);
      document.getElementById("h3-btn").classList.toggle("active", false);
      document.getElementById("h4-btn").classList.toggle("active", false);

      if(selText.tagName === "P"){
        document.getElementById("p-btn").classList.toggle("active", true);
      }else if(selText.tagName === "H1") {
        document.getElementById("h1-btn").classList.toggle("active", true);
      }else if(selText.tagName === "H2") {
        document.getElementById("h2-btn").classList.toggle("active", true);
      }else if(selText.tagName === "H3") {
        document.getElementById("h3-btn").classList.toggle("active", true);
      }else if(selText.tagName === "H4") {
        document.getElementById("h4-btn").classList.toggle("active", true);
      }
    }

  }
}


window.onclick = function(event) {
  if (!event.target.classList.contains('dropdown') && !event.target.classList.contains('dropdown-content') && !event.target.classList.contains('icon') && !event.target.classList.contains('dropdown-item') && !event.target.classList.contains('dropdown-item-text') && event.target.tagName !== "INPUT" && event.target.tagName !== "LABEL" ) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show-flex')) {
        openDropdown.classList.remove('show-flex');
      }
    }
  }
}

document.getElementsByClassName("post-table")[0].addEventListener("click", (e) => {
  let tar = e.target,ispostSub=false;
  if(tar.classList.contains("post-sub")){
    if(current_sub !== "") {
      document.getElementById(current_sub).classList.toggle("selected", false);
    }
    current_sub = tar.id;
    document.getElementById(current_sub).classList.toggle("selected", true);
    postSub = tar;
    tar = tar.parentElement;
    while (!tar.classList.contains("post-column") || tar.classList.contains("post-sub")) {
      tar = tar.parentElement;
    }
    ispostSub= true;
    loadStyle(e.target);
  }else if (!tar.classList.contains("post-column")) {
    while (!tar.classList.contains("post-column")) {
      tar = tar.parentElement;
    }
  }
  if (tar.classList.contains("post-column")) {
    if (!ispostSub && current_sub !== "") {
      document.getElementById(current_sub).classList.toggle("selected", false);
    }
    if(current_col !=="") {
      document.getElementById(current_col).classList.toggle("selected", false);
    }
    current_col = tar.id;
    document.getElementById(current_col).classList.toggle("selected", true);
    current_row = tar.parentElement.id;
    target = tar;
    if(!ispostSub) {
      loadStyle(tar);
    }
    selSPAN = null;

  }
  console.log(current_row)

  if(!e.target.classList.contains("post-sub")){

    current_sub = "";

  }

  if(e.target.tagName ==="SPAN"){
    target = e.target;
    loadStyle(e.target);
    selSPAN = e.target;

  }

  if(e.target.tagName ==="A"  ||  e.target.parentElement.tagName ==="A") {
    selLINK = e.target;
    link_toolbar.style.display = "flex";
    link_toolbar.style.top = e.clientY + 20 + "px";
    link_toolbar.style.left = e.clientX + "px";
    link_toolbar.children[0].value = e.target.innerText;
    link_toolbar.children[1].value = e.target.href;


  }else
   {
    selLINK = null;
    link_toolbar.style.display = "none";
  }

  if( e.target.parentElement.tagName ==="A"){

    selLINK = e.target.parentElement;
  }

  let txt = [document.getElementById("h1-btn"),document.getElementById("h2-btn"),document.getElementById("h3-btn"),document.getElementById("h4-btn"),document.getElementById("p-btn")];

  txt.forEach((e)=>{
    e.classList.toggle("active", false);
  })

  if(e.target.tagName === "P" || e.target.parentElement.tagName === "P") {
    selText = e.target;
    if(e.target.parentElement.tagName === "P"){
      selText = e.target.parentElement;
    }
    document.getElementById("p-btn").classList.toggle("active", true);
    target = e.target.parentElement;
    loadStyle()
  }else if(e.target.tagName === "H1" || e.target.parentElement.tagName === "H1") {
    selText = e.target;
    if(e.target.parentElement.tagName === "H1"){
      selText = e.target.parentElement;
    }
    document.getElementById("h1-btn").classList.toggle("active", true);
    target = e.target.parentElement;
    loadStyle()
  }else if(e.target.tagName === "H2" || e.target.parentElement.tagName === "H2") {
    selText = e.target;
    if(e.target.parentElement.tagName === "H2"){
      selText = e.target.parentElement;
    }
    document.getElementById("h2-btn").classList.toggle("active", true);
    target = e.target.parentElement;
    loadStyle()
  }else if(e.target.tagName === "H3" || e.target.parentElement.tagName === "H3") {
    selText = e.target;
    if(e.target.parentElement.tagName === "H3"){
      selText = e.target.parentElement;
    }
    document.getElementById("h3-btn").classList.toggle("active", true);
    target = e.target.parentElement;
    loadStyle()
  }else if(e.target.tagName === "H4" || e.target.parentElement.tagName === "H4") {
    selText = e.target;
    if(e.target.parentElement.tagName === "H4"){
      selText = e.target.parentElement;
    }
    document.getElementById("h4-btn").classList.toggle("active", true);
    target = e.target.parentElement;
    loadStyle()
  }else{
    selText = null;
  }

});

selectedBox.children[0].addEventListener("click", (e) => {
  if(e.target.checked) {
    selected = [];
    let cols = document.getElementsByClassName("post-column");
    for (let i = 0; i < cols.length; i++) {
      cols[i].classList.add("selected");
      selected.push(cols[i].id);
    }
  }
    else{
      let cols = document.getElementsByClassName("post-column");
      for(let i=0;i<cols.length;i++){
        cols[i].classList.remove("selected");
      }
      selected = [];
    }
    selectedBox.children[1].innerText = selected.length;
    if(selected.length===0){
      selectedBox.classList.add("hidden");
    }

})


rowSelectedBox.children[0].addEventListener("click", (e) => {
  let cols = document.getElementsByClassName("post-row");
  if(e.target.checked) {
    groupSelection = [];
    for (let i = 0; i < cols.length; i++) {
      cols[i].classList.add("selected");
      groupSelection.push(cols[i].id);
    }
  }
  else{
    for(let i=0;i<cols.length;i++){
      cols[i].classList.remove("selected");
    }
    groupSelection = [];
  }
  rowSelectedBox.children[1].innerText = groupSelection.length;
  if(groupSelection.length===0){
    rowSelectedBox.classList.add("hidden");
  }

})

let savedSelection;

function saveSelection(e) {

  console.log(e.target)
  if (window.getSelection) {
    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
      savedSelection = selection.getRangeAt(0);
    }
  } else if (document.selection && document.selection.createRange) { // IE
    savedSelection = document.selection.createRange();
    console.log(e.target)
  }
}

function subrecurse(el){
  if(el.id.split("-")[0]==="sc"){

    let sub = new SubColumn();
    objects[sub.element.id] = sub;

    if(el.querySelector(".post-sub") === null) {
      sub.element.innerHTML = el.innerHTML;
    }else{
      sub.element.classList.add("sub-col");
      sub.element.style.padding="0";
      let childs = el.children;
      for(let i=0;i<childs.length;i++){
        let el = subrecurse(childs[i]);
        objects[sub.element.id].element.appendChild(el);
        objects[sub.element.id].subs.push(el.id);
      }
    }
    objects[sub.element.id] = sub;
    if(current_sub ==="") {
      objects[current_col].subs.push(sub.element.id);
    }else{
      objects[current_sub].subs.push(sub.element.id);

    }
    return sub.element;
  }else if(el.id.split("-")[0]==="sr"){

    let sub = new SubRow()
    objects[sub.element.id] = sub;

    if(el.querySelector(".post-sub") === null) {
      sub.element.innerHTML = el.innerHTML;
    }else{
      sub.element.classList.add("sub-col");
      sub.element.style.padding="0";
      let childs = el.children;
      for(let i=0;i<childs.length;i++){
        let el = subrecurse(childs[i]);
        objects[sub.element.id].element.appendChild(el);
        objects[sub.element.id].subs.push(el.id);
      }
    }
    objects[sub.element.id] = sub;
    if(current_sub ==="") {
      objects[current_col].subs.push(sub.element.id);
    }else{
      objects[current_sub].subs.push(sub.element.id);

    }
    return sub.element;
  }

}

function load_table(){
  document.getElementsByClassName("post-table")[0].innerHTML = "";
  objects={};
  current_row = "";
  current_col = "";
  current_sub = "";
  col_count = 0;
  row_count = 0;
  sub_count = 0;
  let input = document.createElement("input");
  input.type = "file";
  input.accept = ".html";
  input.click();
  input.oninput = function(){
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(){
      let parser = new DOMParser();
      let doc = parser.parseFromString(reader.result, "text/html");
      let rows = doc.getElementsByClassName("post-row");
      for(let i=0;i<rows.length;i++){
        if(!rows[i].classList.contains("post-sub")) {
          let row = new Row();
          objects[row.element.id] = row;
          row.element.style.height = rows[i].style.height;
          document.getElementsByClassName("post-table")[0].appendChild(row.element);

          for (let j = 0; j < rows[i].children.length; j++) {
            if (rows[i].children[j].classList.contains("post-column")) {
              let col = new Column();
              objects[col.element.id] = col;
              objects[row.element.id].columns.push(col.element.id);
              col.element.addEventListener("click", handleSelection);
              if (rows[i].children[j].querySelector(".post-sub") === null) {
                col.element.innerHTML = rows[i].children[j].innerHTML;
              } else {
                objects[col.element.id].element.classList.add("sub-col");
                objects[col.element.id].element.style.padding = "0";
                let childs = rows[i].children[j].children;
                for (let k = 0; k < childs.length; k++) {
                  if (childs[k].classList.contains("post-sub")) {
                    let sub = subrecurse(childs[k])
                    console.log(childs[k])
                    objects[col.element.id].element.appendChild(sub);
                    objects[col.element.id].subs.push(sub.id);
                  }
                }
              }
              row.element.insertBefore(col.element, row.element.lastElementChild);
              objects[col.element.id].element.addEventListener("mouseup", saveSelection);
              objects[col.element.id].element.style.width = rows[i].children[j].style.width;
              objects[col.element.id].element.style.backgroundColor = rows[i].children[j].style.backgroundColor;
              objects[col.element.id].element.style.border = rows[i].children[j].style.border;
              objects[col.element.id].element.style.borderTop = rows[i].children[j].style.borderTop;
              objects[col.element.id].element.style.borderBottom = rows[i].children[j].style.borderBottom;
              objects[col.element.id].element.style.borderLeft = rows[i].children[j].style.borderLeft;
              objects[col.element.id].element.style.borderRight = rows[i].children[j].style.borderRight;
              objects[col.element.id].element.style.fontSize = rows[i].children[j].style.fontSize;
              objects[col.element.id].element.style.color = rows[i].children[j].style.color;
              objects[col.element.id].element.style.textAlign = rows[i].children[j].style.textAlign;
              objects[col.element.id].element.style.alignContent = rows[i].children[j].style.alignContent;
              objects[col.element.id].element.style.fontWeight = rows[i].children[j].style.fontWeight;
              if(rows[i].children[j].colSpan !== undefined) {
                objects[col.element.id].element.colSpan = rows[i].children[j].colSpan;
              }
              if(rows[i].children[j].rowSpan !== undefined) {
                objects[col.element.id].element.rowSpan = rows[i].children[j].rowSpan;
              }
            }
            col_count++;
          }
          row_count++;
        }
      }
    }
  }
}

function save_table(){
  let tableHTML = document.getElementById("posttable").outerHTML;
  console.log(tableHTML)
  let blob = new Blob([tableHTML], {type: "text/html"});
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  let filename = prompt("Enter filename");
  if(filename === null){
    return;
  }
  a.download = filename+".html";
  a.click();
}

function format(html) {
  var tab = '    ';
  var result = '';
  var indent= '';

  html.split(/>\s*</).forEach(function(element) {
    if (element.match( /^\/\w/ )) {
      indent = indent.substring(tab.length);
    }

    result += indent + '<' + element + '>\r\n';

    if (element.match( /^<?\w[^>]*[^\/]$/ ) && !element.startsWith("input")  ) {
      indent += tab;
    }
  });

  return result.substring(1, result.length-3);
}

function toggle_preview(){
  document.getElementById("prev-window").classList.toggle("hidden");
}

function load_preview(){
  let tableHTML = `<!doctype html>
  <html class="no-js" lang="">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
    body,html{
      margin: 0;
      padding: 0;
    width: 100vw;
    height: 100vh;
    }
    table{

    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
    }

td, th {
  padding: 8px;
}
</style>
    </head>
  <body><div style="width: 100%;"><table border="1"><tbody>`;
  let rows = document.getElementsByClassName("post-row");
  for(let i=0;i<rows.length;i++){
    if(rows[i].classList.contains("post-row")) {
      let rowHTML = "<tr>";
      for (let j = 0; j < rows[i].children.length; j++) {
        if (rows[i].children[j].classList.contains("post-column")) {
          let col = rows[i].children[j].cloneNode(true);
          col.contentEditable = false;
          rowHTML += col.outerHTML;

        }
      }
      rowHTML += "</tr>";
      tableHTML += rowHTML;
    }
  }
  tableHTML +="</tbody></table></div></body></html>";
  tableHTML = tableHTML.replaceAll("contenteditable='true'", "");
  tableHTML = tableHTML.replaceAll("contenteditable='false'", "");
  tableHTML = tableHTML.replaceAll("contenteditable=\"false\"", "");
  tableHTML = tableHTML.replaceAll("contenteditable=\"true\"", "");
  tableHTML = tableHTML.replaceAll("class=\"post-column\"", "");
  tableHTML= format(tableHTML);
  document.getElementById("prev-box").src = "data:text/html;charset=utf-8," + escape(tableHTML);
}

function copy_table(){
  let tableHTML = "<table width='800' border='1'><tbody>";
  let rows = document.getElementsByClassName("post-row");
  for(let i=0;i<rows.length;i++){
    if(rows[i].classList.contains("post-row")) {
      let rowHTML = "<tr>";
      for (let j = 0; j < rows[i].children.length; j++) {
        if (rows[i].children[j].classList.contains("post-column")) {
          console.log(objects)
          let col = objects[rows[i].children[j].id].element.cloneNode(true);
          col.contentEditable = false;
          rowHTML += col.outerHTML;

        }
      }
      rowHTML += "</tr>";
      tableHTML += rowHTML;
    }
  }
  tableHTML +="</tbody></table>";
  tableHTML = tableHTML.replaceAll("contenteditable='true'", "");
  tableHTML = tableHTML.replaceAll("contenteditable='false'", "");
  tableHTML = tableHTML.replaceAll("contenteditable=\"false\"", "");
  tableHTML = tableHTML.replaceAll("contenteditable=\"true\"", "");
  tableHTML = tableHTML.replaceAll("class=\"post-column\"", "");
  tableHTML= format(tableHTML);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // Use Clipboard API if available
    navigator.clipboard.writeText(tableHTML).then(function() {
      console.log('Copying to clipboard was successful!');
      alert("HTML copied to clipboard");
    }, function(err) {
      console.error('Could not copy text: ', err);
    });
  } else {
    // Fallback to document.execCommand('copy')
    let textarea = document.createElement('textarea');
    textarea.textContent = tableHTML;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      alert("HTML copied to clipboard");
      return document.execCommand('copy'); // Security exception may be thrown by some browsers.
    } catch (ex) {
      document.getElementById("copy-html").innerText = tableHTML;
      document.getElementsByClassName("window")[0].style.display = "flex";
      console.warn('Copy to clipboard failed.', ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

function set_view_width(width){
  document.querySelector("iframe").style.width=width
}

function  handleSelection(e){
    if(e.ctrlKey || e.metaKey){
      let sel = e.target;
      if(!sel.classList.contains("post-column")){
        sel = sel.closest(".post-column");
      }
      sel.classList.toggle("selected");
      if(selected.includes(sel.id)){
        selected = selected.filter((item) => item !== sel.id);
        if(selected.length===0){
          selectedBox.classList.add("hidden");
        }
      }else {
        if(selected.length===0){
          selectedBox.classList.remove("hidden");
        }
        selected.push(sel.id);
      }

      selectedBox.children[1].innerText = selected.length;
    }else {
      selected.forEach((item) => {
        console.log(document.getElementById(item))
        document.getElementById(item).classList.remove("selected");
      });
      selectedBox.classList.add("hidden");
      selected = [];
    }
}

let btns = document.getElementById("toolbar").getElementsByClassName('btn');

for(let i=0;i<btns.length;i++){
  btns[i].addEventListener('click',function(){
    loadStyle()
  });
}

function undo(){
  if(historyIndex > 0){
    historyIndex--;
    let data = histrory[historyIndex];
    objects = data[0];
    row_count = data[1];
    col_count = data[2];
    current_col = data[3];
    current_row = data[4];
    document.getElementsByClassName("post-table")[0].innerHTML = data[5];
    isUndo=true;
    set_listens();
  }
}

function redo(){
  if(historyIndex < histrory.length){
    historyIndex++;
    let data = histrory[historyIndex];
    objects = data[0];
    row_count = data[1];
    col_count = data[2];
    current_col = data[3];
    current_row = data[4];
    document.getElementsByClassName("post-table")[0].innerHTML = data[5];
    isUndo=true;
    set_listens();
  }
}


function handelSelectRow(e){
  if(e.ctrlKey || e.metaKey){
    let sel = e.target;
    while(!sel.classList.contains("post-row")){
      sel = sel.parentElement;
    }
    sel.classList.toggle("selected");
    if( groupSelection.includes(sel.id)){
      groupSelection = groupSelection.filter((item) => item !== sel.id);
      if(groupSelection.length===0){
        rowSelectedBox.classList.add("hidden");
      }
    }else {
      if(groupSelection.length===0){
        rowSelectedBox.classList.remove("hidden");
      }
      groupSelection.push(sel.id);
    }

    rowSelectedBox.children[1].innerText = groupSelection.length;
  }else {
    console.log(groupSelection)
    groupSelection.forEach((item) => {
      document.getElementById(item).classList.remove("selected");
    });
    rowSelectedBox.classList.add("hidden");
    groupSelection = [];
  }
}

function copy_row(){
  rowObjects = groupSelection;
  groupSelection.forEach((item) => {
    document.getElementById(item).classList.remove("selected");
  })
}

function paste_row(){

  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(rowObjects.length === 0){
    return;
  }
  rowObjects.forEach(id =>{
    let row = objects[id];
    let newRow = new Row();
    newRow.element.style.height = row.element.style.height;
    objects[newRow.element.id] = newRow;
    document.getElementsByClassName("post-table")[0].appendChild(newRow.element);
    for(let i=0;i<row.columns.length;i++){
      let col = objects[row.columns[i]];
      let newCol = new Column();
      newCol.element.addEventListener("click", handleSelection);
      objects[newCol.element.id] = newCol;
      objects[newRow.element.id].columns.push(newCol.element.id);
      if(col.element.classList.contains("sub-col")) {
        newCol.element.classList.add("sub-col");
        newCol.element.style.padding="0";
        let childs = col.element.children;
        for(let k=0;k<childs.length;k++) {
          let sub =subrecurse(childs[k])
          objects[newCol.element.id].element.appendChild(sub);
          objects[newCol.element.id].subs.push(sub.id);
        }
      }else{
        newCol.element.innerHTML = col.element.innerHTML;
      }
      newCol.element.style.width = col.element.style.width;
      newCol.element.style.backgroundColor = col.element.style.backgroundColor;
      newCol.element.style.border = col.element.style.border;
      newCol.element.style.borderTop = col.element.style.borderTop;
      newCol.element.style.borderBottom = col.element.style.borderBottom;
      newCol.element.style.borderLeft = col.element.style.borderLeft;
      newCol.element.style.borderRight = col.element.style.borderRight;
      newCol.element.style.fontSize = col.element.style.fontSize;
      newCol.element.style.color = col.element.style.color;
      newCol.element.style.textAlign = col.element.style.textAlign;
      newCol.element.style.alignContent = col.element.style.alignContent;
      newCol.element.style.fontWeight = col.element.style.fontWeight;
      if(col.element.colSpan !== undefined) {
        newCol.element.colSpan = col.element.colSpan;

      }
      if (col.element.rowSpan !== undefined) {
        newCol.element.rowSpan = col.element.rowSpan;

      }
      newRow.element.insertBefore(newCol.element, newRow.element.lastElementChild);
      newCol.element.addEventListener("mouseup", saveSelection);
      col_count++;
    }
    row_count++;
  })
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);
  historyIndex = histrory.length-1;
}

function paste_row_a(){
  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(rowObjects.length === 0){
    return;
  }
  let prev_row = current_row;
  rowObjects.forEach(id =>{
    let row = objects[id];
    let newRow = new Row();
    newRow.element.style.height = row.element.style.height;
    objects[newRow.element.id] = newRow;
    document.getElementsByClassName("post-table")[0].insertBefore(newRow.element, document.getElementById(prev_row));
    for(let i=0;i<row.columns.length;i++){
      let col = objects[row.columns[i]];
      let newCol = new Column();
      newCol.element.addEventListener("click", handleSelection);
      objects[newCol.element.id] = newCol;
      objects[newRow.element.id].columns.push(newCol.element.id);

      if(col.element.classList.contains("sub-col")) {
        newCol.element.classList.add("sub-col");
        newCol.element.style.padding="0";
        let childs = col.element.children;
        for(let k=0;k<childs.length;k++) {
          let sub =subrecurse(childs[k])
          objects[newCol.element.id].element.appendChild(sub);
          objects[newCol.element.id].subs.push(sub.id);
        }
      }else{
        newCol.element.innerHTML = col.element.innerHTML;
      }
      newCol.element.style.width = col.element.style.width;
      newCol.element.style.backgroundColor = col.element.style.backgroundColor;
      newCol.element.style.border = col.element.style.border;
      newCol.element.style.borderTop = col.element.style.borderTop;
      newCol.element.style.borderBottom = col.element.style.borderBottom;
      newCol.element.style.borderLeft = col.element.style.borderLeft;
      newCol.element.style.borderRight = col.element.style.borderRight;
      newCol.element.style.fontSize = col.element.style.fontSize;
      newCol.element.style.color = col.element.style.color;
      newCol.element.style.textAlign = col.element.style.textAlign;
      newCol.element.style.alignContent = col.element.style.alignContent;
      newCol.element.style.fontWeight = col.element.style.fontWeight;
      newRow.element.insertBefore(newCol.element, newRow.element.lastElementChild);
      newCol.element.addEventListener("mouseup", saveSelection);
      col_count++;
    }
    row_count++;
  })

  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);
  historyIndex = histrory.length-1;
}

function paste_row_b(){
  if(isUndo){
    let nhistory =[]
    for(let i=0;i<=historyIndex;i++){
      nhistory.push(histrory[i]);
    }
    histrory = nhistory;
    isUndo = false;
  }
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);

  if(rowObjects.length === 0){
    return;
  }
  rowObjects.forEach(id => {
    let next_row = current_row;
    let row = objects[id];
    let newRow = new Row();
    newRow.element.style.height = row.element.style.height;
    objects[newRow.element.id] = newRow;

    for (let i = 0; i < row.columns.length; i++) {
      let col = objects[row.columns[i]];
      let newCol = new Column();
      newCol.element.addEventListener("click", handleSelection);
      objects[newCol.element.id] = newCol;
      objects[newRow.element.id].columns.push(newCol.element.id);

      if(col.element.classList.contains("sub-col")) {
        newCol.element.classList.add("sub-col");
        newCol.element.style.padding="0";
        let childs = col.element.children;
        for(let k=0;k<childs.length;k++) {
          let sub =subrecurse(childs[k])
          objects[newCol.element.id].element.appendChild(sub);
          objects[newCol.element.id].subs.push(sub.id);
        }
      }else{
        newCol.element.innerHTML = col.element.innerHTML;
      }
      newCol.element.style.width = col.element.style.width;
      newCol.element.style.backgroundColor = col.element.style.backgroundColor;
      newCol.element.style.border = col.element.style.border;
      newCol.element.style.borderTop = col.element.style.borderTop;
      newCol.element.style.borderBottom = col.element.style.borderBottom;
      newCol.element.style.borderLeft = col.element.style.borderLeft;
      newCol.element.style.borderRight = col.element.style.borderRight;
      newCol.element.style.fontSize = col.element.style.fontSize;
      newCol.element.style.color = col.element.style.color;
      newCol.element.style.textAlign = col.element.style.textAlign;
      newCol.element.style.alignContent = col.element.style.alignContent;
      newCol.element.style.fontWeight = col.element.style.fontWeight;
      newRow.element.insertBefore(newCol.element, newRow.element.lastElementChild);
      newRow.element.insertBefore(resize_obj.element, newRow.element.lastElementChild);
      newCol.element.addEventListener("mouseup", saveSelection);
      col_count++;
    }
    row_count++;
  })
  histrory.push([objects,row_count,col_count,current_col,current_row,document.getElementsByClassName("post-table")[0].innerHTML]);
  historyIndex = histrory.length-1;
}


function set_listens(){
  let rows = document.getElementsByClassName("post-row");
  for(let i=0;i<rows.length;i++){
    rows[i].children[0].addEventListener("click", handelSelectRow);
  }
  let cols = document.getElementsByClassName("post-column");
  for(let i=0;i<cols.length;i++){
    cols[i].addEventListener("click", handleSelection);
  }
}

function toggle_navigation(){
  document.getElementById("nav-window").classList.toggle("hidden");
}

function setSub(id){
  forcecol = false;
  current_sub= id;
  load_navigation();
  loadStyle(document.getElementById(id));
}
function setcol(id){
  forcecol = true;
  current_col= id;
  load_navigation();
  loadStyle(document.getElementById(id));
}

function recurse_nav(child){
  if(child.classList.contains("post-sub")){
  let div = document.createElement("div");
  div.classList.add("nav");
  let active =""
  if(current_sub === child.id){
    active = "active";
  }
  if(!forcecol) {
    if(child.classList.contains("post-column")) {
      div.innerHTML = `<span class="nav-title ${active}" onclick="setSub('${child.id}')">Sub Column</span>`;
    }else {
      div.innerHTML = `<span class="nav-title ${active}" onclick="setSub('${child.id}')">Sub Row</span>`;
    }
  }else {
    if(child.classList.contains("post-column")) {
      div.innerHTML = `<span class="nav-title" onclick="setSub('${child.id}')">Sub Column</span>`;
    }else {
      div.innerHTML = `<span class="nav-title" onclick="setSub('${child.id}')">Sub Row</span>`;
    }
  }
    let childs = child.children;
    for(let i=0;i<childs.length;i++){
      div.appendChild(recurse_nav(childs[i]));
    }
    return div;
  }else{
    return document.createElement("div");
  }
}

function load_navigation(){
  navBox.innerHTML = "";
  if(current_col!==""){
    let div = document.createElement("div");
    div.classList.add("nav");
    if(forcecol) {
      div.innerHTML = `<span class="nav-title active" onclick="setcol('${current_col}')">Column</span>`;
    }else {
      div.innerHTML = `<span class="nav-title" onclick="setcol('${current_col}')">Column</span>`;
    }
    let childs = document.getElementById(current_col).children;
    for(let i=0;i<childs.length;i++){
      div.appendChild(recurse_nav(childs[i]));
    }
    navBox.appendChild(div);
  }
}


function set_Colspan(span){

  if(selected.length === 0) {
    let col = objects[current_col];
    col.element.colSpan = span;
  }else{
    selected.forEach((item) => {
      let col = objects[item];
      col.element.colSpan = span;
    })
  }
}
function set_Rowspan(span){
  if(selected.length === 0) {
    let col = objects[current_col];
    console.log(col)
    col.element.rowSpan = span;
  }else{
    selected.forEach((item) => {
      let row = objects[item];
      row.element.rowSpan = span;
    })
  }
}
