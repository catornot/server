window.addEventListener( "load", () => {
    const btnUpload = document.getElementById("upload");
    // const divOutput = document.getElementById("file");
    const f = document.getElementById("file");

    f.addEventListener("onchange", () => {

        const fileReader = new FileReader();
        const theFile = f.files[0];
        console.log( "yes" )
    } )
} )