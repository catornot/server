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
        // console.log( files );

        for( var i = 0; i < files.length ; i++ ) {
            if ( !check_multifile_logo( files[i] ) ) { continue }
            if ( !files[i].type.match( "image" ) ) { continue }

            const picReader = new FileReader();

            picReader.onload = async event => {
                const picFile = event.target;
                const section = document.createElement( "section" );
                section.className = "imgsection";
                const id = `${ Math.random() * 1000 * Math.random() }`
                section.innerHTML = `<label class="piclabel" id="${ id }"> ${ 0 }% </label>`;
                display.appendChild( section );

                const label = document.getElementById( id );
                
                const CHUNK_SIZE = 2000;
                const chunkCount = picFile.result.byteLength / CHUNK_SIZE;
                for( let chunkId = 0; chunkId < chunkCount + 1; chunkId++ ) {

                    const chunk = picFile.result.slice( chunkId * CHUNK_SIZE, chunkId * CHUNK_SIZE + CHUNK_SIZE );
                
                    await fetch ( "http://localhost:7878/upload", {
                        "method": "POST-IMAGE",
                        "headers": {
                            "content-length": chunk.length,
                            "file-name": id
                        }
                    } )

                    label.innerHTML = `${ parseInt( chunkId * CHUNK_SIZE / parseInt( picFile.result.byteLength ) * 100 ) }%`;
                }

                console.log( picFile.result.byteLength );

                label.innerHTML = `${ 100 }%`;
            };

            // console.log( files[i] );
            
            picReader.readAsArrayBuffer( files[i] );
        }
    } )
} )

// $('#multi_file_upload').change(function(e) {
//     var file_id = e.target.id;

//     var file_name_arr = new Array();
//     var process_path = site_url + 'public/uploads/';

//     for (i = 0; i < $("#" + file_id).prop("files").length; i++) {

//         var form_data = new FormData();
//         var file_data = $("#" + file_id).prop("files")[i];
//         form_data.append("file_name", file_data);

//         if (check_multifile_logo($("#" + file_id).prop("files")[i]['name'])) {
//             $.ajax({
//                 //url         :   site_url + "inc/upload_image.php?width=96&height=60&show_small=1",
//                 url: site_url + "inc/upload_contact_info.php",
//                 cache: false,
//                 contentType: false,
//                 processData: false,
//                 async: false,
//                 data: form_data,
//                 type: 'post',
//                 success: function(data) {
//                     // display image
//                 }
//             });
//         } else {
//             $("#" + html_div).html('');
//             alert('We only accept JPG, JPEG, PNG, GIF and BMP files');
//         }

//     }
// });

function check_multifile_logo(file) {
    let extension = file.type
    if (extension === 'image/jpg' || extension === 'image/jpeg' || extension === 'image/png' ) {
        return true;
    } else {
        return false;
    }
}