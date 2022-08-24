use std::net::TcpListener;
use std::net::TcpStream;
use std::io::prelude::*;
use std::fs;
use serde_derive::Deserialize;
use serde_derive::Serialize;

#[derive(Serialize,Deserialize)]
struct AllowedResponse {
    get:Vec<String>
}
struct Response {
    response:String,
    content:String
}

impl Response {
    // fn set_not_found_reponse( &mut self ) {
    //     self.response = String::from( "HTTP/1.1 404 NOT FOUND" );
    //     self.content = fs::read_to_string( "404.html" ).unwrap();
    // }
    
    fn set_html_content( &mut self, request:&str ) {
    
        println!( "page {}", request );
    
        if request == "/" {
            self.content = fs::read_to_string( "index.html" ).unwrap()
        }
        else {
            let mut path = request.to_string();
            path.push_str( ".html" );
    
            self.set_content_by_path( &path[..] )
        }
    }
    
    fn set_content_by_path( &mut self, path:&str ) {
        
        let mut path_str = path.to_string();
        path_str.remove(0);

        let content = if path_str.ends_with( ".png" ) {
            fs::read_to_string( path_str )
        }
        else {
            fs::read_to_string( path_str )
        };
    
        self.content = match content {
            Err( err ) => { 
                println!( "{}", err );
                println!( "path : {}", path );
                let r = not_found_reponse();
                self.response = r.response;
                r.content
            },
            Ok( content ) => content
        }
    }
}

const OK:&str = "HTTP/1.1 200 OK";

fn main() {
    let listener:TcpListener = match TcpListener::bind( "127.0.0.1:7878" ) {
        Err( err ) => { println!( "port isn't available {}", err ); return },
        Ok( listener ) => listener,
    };

    for stream in listener.incoming() {
        let stream = stream.expect( "couldn't connect" );

        println!( "connection established" );

        handle_connection( stream )
    }
}

fn handle_connection( mut stream:TcpStream ) {
    let mut buffer = [ 0; 1024 ];

    stream.read( &mut buffer ).expect( "couldn't read stream" );

    let response_ = get_response_from_request( buffer );

    let response = format!(
        "{}\r\nContent-Length: {}\r\n\r\n{}",
        response_.response,
        response_.content.len(),
        response_.content
    );

    stream.write( response.as_bytes() ).unwrap();
    stream.flush().unwrap();
}

fn get_response_from_request( buffer:[u8; 1024] ) -> Response {

    let http_request: Vec<_> = buffer
        .lines()
        .map(|result| result.unwrap())
        .take_while(|line| !line.is_empty())
        .collect();
    
    let request = &http_request[0];
    println!( "{}", request );

    let json = fs::read_to_string( "allowed_requests.json" ).unwrap();
    // let allowed:AllowedResponse = match serde_json::from_str( &json ) {
    //     Err( e ) => return Response {
    //         response: String::from( "HTTP/1.1 404 NOT OK" ), 
    //         content: fs::read_to_string( "404.html" ).unwrap()
    //     },
    //     Ok( allowed ) => allowed.unwrap()
    // };

    let res = serde_json::from_str( &json[..] );

    let allowed:AllowedResponse = if res.is_ok() {
        res.unwrap()
    }
    else {
        return not_found_reponse();
    };
    
    let mut offset = 0;
    let mut request_type = "none";
    for c in request.chars() {
        if c == ' ' {
            request_type = &request[..offset];
            break;
        }
        offset += 1
    };

    let mut response:Response = not_found_reponse();

    if request_type == "GET" { // we may be able to make a function to handle post/del etc
        let allowed = &allowed.get;
        
        
        for a in request.split( " " ) {
            for x in 0..allowed.len() {
                if allowed[x] == a {
                    println!( "{}", a );
                    
                    response.response = OK.to_string();

                    if a.to_string().find( "." ) == None {
                        response.set_html_content( a );
                    }
                    else {
                        response.set_content_by_path( a );
                    }
                }
            }
        }
    }

    // println!("Request: {:#?}", http_request);

    return response
}

fn not_found_reponse() -> Response {
    return Response {
        response: String::from( "HTTP/1.1 404 NOT FOUND" ), 
        content: fs::read_to_string( "404.html" ).unwrap()
    }
}