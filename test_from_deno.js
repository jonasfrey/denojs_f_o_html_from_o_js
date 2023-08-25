import {
    f_o_html_from_o_js 
  // }  from "https://deno.land/x/f_o_html_from_o_js@[version]/mod.js"
  }  from "./localhost/client.module.js"

  var o_js = {
    id: "main",
    a_o: [
        {
            id: "test_div",
            s_tag : "div", 
            innerText: "test"
        },
        {
            innerText: `this will render only every even second, time now is ${parseInt(new Date().getTime()/1000.)}`, 
            b_render: parseInt(new Date().getTime()/1000.) % 2 == 0
        },
        {
            s_tag : "input", 
            type: "number",
            value: 10,
            onchange: function(){
                console.log(this);
                console.log("number is : "+this.value)
                // f_render() // this wont work , because when we render the html object will be re-rendered and be replaced  and so we loose the focus to the input element
            }
        },
        {
            s_tag : "a", 
            href: "https://deno.land",
            a_o:[
                {
                    s_tag: "div", 
                    innerText : "deno.land"
                }
            ]
        },
        ...Array(3).fill(0).map(
            function(n, n_idx){
                return {
                    id: `my_div_id_${n_idx}`, 
                    innerText: `this is the div no.:${n_idx+1}`
                }
            }
        ), 
        {
            s_tag: 'input', 
            list: 'a_s_animal', 
        },
        {
            s_tag: 'datalist', 
            id: "a_s_animal",
            a_o: [
                ...['luchs', 'pferd', 'schildkroete'].map(function(s){
                    return {
                        s_tag: 'option', 
                        value: s
                    }
                })
            ]
        }
    ]
}

let o_html = f_o_html_from_o_js(
    o_js
)
console.log(o_html.outerHTML)

