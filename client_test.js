var o_div = document.createElement("div");
o_div.appendChild(document.createElement("div"))
document.body.appendChild(o_div)
var f_render = function(){

    var o = {
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
            )
        ]
    }
    var o_html = f_o_html_from_o_js(o);
    o_div.replaceChild(o_html, o_div.firstChild)
    document.body.appendChild(o_div)
}
f_render();
