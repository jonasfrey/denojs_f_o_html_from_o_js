import {
    f_o_html__and_make_renderable
} from "./mod.js"



let o = await f_o_html__and_make_renderable(
    
    {
        // s_tag: 'h1', 
        // innerText: 'hello', 
        // onclick: function(o_e){console.log(o_e)}
        a_o: [
            { s_tag: "h1", innerText: ".//" },
            { s_tag: "a", href: "test_for_fileserver" },
            { s_tag: "a", href: "mod.js" },
            { s_tag: "a", href: "test.html" },
            { s_tag: "a", href: "custom.crt" },
            { s_tag: "a", href: "custom.key" },
            { s_tag: "a", href: "self_signed_cert.crt" },
            { s_tag: "a", href: "test" },
            { s_tag: "a", href: "test.module.js" },
            { s_tag: "a", href: "test_server.js" },
            { s_tag: "a", href: "self_signed_key.key" }
          ]
    }
)
console.log(o.innerHTML)