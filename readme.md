# usage 
```javascript
var o = {
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
        )
    ]
}
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