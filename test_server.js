import {
    f_o_html__and_make_renderable
} from "./mod.js"



let o = await f_o_html__and_make_renderable(
    {
        s_tag: 'h1', 
        innerText: 'hello', 
        // onclick: function(o_e){console.log(o_e)}
    }
)
console.log(o.innerHTML)