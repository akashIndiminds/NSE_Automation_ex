

 function handleIncrementFiles(_element){
    let temp = _element.filetype.split('-');
    let i = parseInt(temp[1]);
    console.log(i);
    if(_element.spStatus!=404 && _element.dlStatus == 200){
      i+=1;
      let str = temp[0]+'-'+i;
      console.log(str);
      _element.filetype =str;
      console.log(_element.filetype);
      _element.dlStatus = 404;
      _element.spStatus = 404;  
    }
    const temFilename = addCounter(_element.filename, i);
    _element.filename = temFilename;
    return _element;
}

function addCounter(filename , counter){
  try {
    if(counter/10 < 1) {
      counter ="0"+ counter;
    }
   const newfilename = filename.replace("^", counter);
    return newfilename;
  } catch (error) {
    // console.log("here");
  }  

}



export default handleIncrementFiles;