window.addEventListener( "load", () => {
    const btnUpload = document.getElementById( "upload" );
    const display = document.getElementById("display");
    const f = document.getElementById( "file" );

    f.addEventListener( "change", ( e ) => {

        if ( window.File && window.FileReader && window.FileList && window.Blob ) {

        }
        else {
            alert( "Your Brower doesn't support the File API" );
            return
        }
    
        const files = f.files;

        for( var i = 0; i < files.length ; i++ ) {
            if ( !check_file_format( files[i] ) ) { continue }
            if ( !files[i].type.match( "image" ) ) { continue }

            const picReader = new FileReader();
            const file = files[i];

            picReader.onload = async event => {
                const picFile = event.target;
                const section = document.createElement( "section" );
                section.className = "imgsection";
                const id = `${ file.name }.${ Math.random() * 1000 * Math.random() }`
                section.innerHTML = `<label class="piclabel" id="${ id }">${ file.name } ${ 0 }%</label>`;
                display.appendChild( section );

                const label = document.getElementById( id );
                
                const CHUNK_SIZE = 1500;
                const chunkCount = picFile.result.byteLength / CHUNK_SIZE;
                for( let chunkId = 0; chunkId < chunkCount + 1; chunkId++ ) {

                    const chunk = picFile.result.slice( chunkId * CHUNK_SIZE, chunkId * CHUNK_SIZE + CHUNK_SIZE );
                    
                    console.log( chunk.byteLength );

                    let base64chunk = btoa(String.fromCharCode.apply(null, new Uint8Array( chunk )));

                    let length = base64chunk.length

                    await fetch ( "http://localhost:7878/upload", {
                        "method": "POST-IMAGE",
                        "headers": {
                            "length": length,
                            "file-name": id,
                            "body": base64chunk,
                        },
                    } )

                    label.innerHTML = `${ file.name } ${ parseInt( chunkId * CHUNK_SIZE / parseInt( picFile.result.byteLength ) * 100 ) }%`;
                }

                label.innerHTML = `${ file.name } ${ 100 }%`;
            };
            
            picReader.readAsArrayBuffer( file );
        }
    } )
} )

function check_file_format(file) {
    let extension = file.type
    if (extension === 'image/jpg' || extension === 'image/jpeg' || extension === 'image/png' ) {
        return true;
    } else {
        return false;
    }
}