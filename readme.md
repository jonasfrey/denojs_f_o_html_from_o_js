# usage 
```javascript
import {f_o_html_from_o_js} from "https://deno.land/x/f_o_html_from_o_js@0.6/mod.js";

let n_count = 5;
var o_a_o = {
    f_o_js(){

        return {
            a_o: [
                {
                    'innerText': `number of elements: ${n_count}`
                },
            ... (new Array(parseInt(n_count))).fill(0).map(
                function(n, n_idx){
                    console.log(n_idx)
                    return {
                        id: `my_div_id_${n_idx}`, 
                        innerText: `this is the div no.:${n_idx+1}`
                    }
                }
            )
            ]
            
        }
    }
}
var o = {
    f_o_js(){
        return {
            id: "main",
            a_o: [
                {
                    id: "test_div",
                    s_tag : "div", 
                    innerText: "test"
                },
                {
                    s_tag : "input", 
                    type: "number",
                    value: n_count,
                    onchange: function(){
                        // console.log(this);
                        // console.log("number is : "+this.value)
                        n_count = parseInt(this.value);
                        o_a_o._f_render();

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
                o_a_o
            ]
        }
    },
}
window.o_a_o = o_a_o;
// o_a_o._f_render();

var o_html = f_o_html_from_o_js(o);

```
## will result in o_html.html
```html
<div id="main">
    <div id="test_div" s_tag="div" innertext="test">test</div><input s_tag="input" type="number" value="10"><a s_tag="a"
        href="https://deno.land">
        <div s_tag="div" innertext="deno.land">deno.land</div>
    </a>
    <div id="my_div_id_0" innertext="this is the div no.:1">this is the div no.:1</div>
    <div id="my_div_id_1" innertext="this is the div no.:2">this is the div no.:2</div>
    <div id="my_div_id_2" innertext="this is the div no.:3">this is the div no.:3</div>
</div>
```