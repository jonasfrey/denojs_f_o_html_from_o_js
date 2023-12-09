<!-- {"s_msg":"this file was automatically generated","s_by":"f_generate_markdown.module.js","s_ts_created":"Sat Dec 09 2023 17:50:57 GMT+0100 (Central European Standard Time)","n_ts_created":1702140657586} -->
# usage
## import library
```javascript
import {
    f_o_html__and_make_renderable 
  // }  from "https://deno.land/x/f_o_html__and_make_renderable@[version]/mod.js"
  }  from "./client.module.js"
```
## most simple example
```javascript
  document.body.appendChild(
    f_o_html__and_make_renderable(
      {
        s_tag: 'button', 
        innerHTML: `i am a rendered button: ${window.performance.now()}`, 
        onclick: function(){
            alert("hey, you clicked me!")
        }
      }
    )
  );
```
## we now can add child objects and render arrays like this
```javascript
  document.body.appendChild(
    f_o_html__and_make_renderable(
      {
        s_tag: 'div', 
        a_o:[
          {
            s_tag: "button", 
            innerText: "i am a button"
          }, 
          ...[1,2,3,4].map(function(n){
            return {
              s_tag: "button", 
              innerText: `i am button number: ${n}`
            }
          })
        ]
      }
    )
  );
  
```
## re-rendering of objects/'components'
we need to add the `f_o_js` function which returns a javascript object
it will get called on every ._f_render() call
```javascript
  var a_s_animal = ['luchs', 'pferd', 'schildkroete']
  var o_js__a_s_animal = {
    f_o_js: function(){
      return {
        a_o: [
          ...a_s_animal.map(function(
            s,
            n_idx 
          ){
            return {
              s_tag:'option',
              innerText: `animal number ${n_idx} is called: '${s}'`
            }
          })
        ]
      }
    }
  }
  var o_html = f_o_html__and_make_renderable(
    {
      a_o: [
        {
          s_tag: "h2", 
          innerText: "This is my app"
        }, 
        o_js__a_s_animal// we can add the object / 'component' here
      ]
    }
  );
  document.body.appendChild(o_html)
  // we can manually render the single object / 'component' like this
  o_js__a_s_animal._f_render();
  // so we can write/read the array and then render it
  a_s_animal.push('rabbit')
  o_js__a_s_animal._f_render();
  // we can also render only after multiple manipulations
  a_s_animal.push('deer')
  a_s_animal.push('whale')
  a_s_animal.push('bird')
  o_js__a_s_animal._f_render();
  
```
## more complex object
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
  
  document.body.appendChild(
    f_o_html__and_make_renderable(o)
  )
  let a_s_name = ['hans', 'juerg', 'sabine', 'sandra']
  let o_js__a_s_name = null;
  o_js__a_s_name = {
    f_o_js: function(){
      return {
          a_o:[
            ...a_s_name.map((s, n_idx)=>{
              return {
                innerText: s,
                onclick: function(e){
                  console.log('event e')
                  console.log(e)
                  a_s_name[n_idx] = a_s_name[n_idx] + 'a';
                  o_js__a_s_name?._f_render();
                }
              }
            })
          ]
        }
      
    }
  }
  let o_js_everything = {
  
    f_o_js: function(){
      return {
        a_o: [
          o_js__a_s_name
        ]
      }
    }
  }
  
  document.body.appendChild(
    f_o_html__and_make_renderable(o_js_everything)
  )
  
```