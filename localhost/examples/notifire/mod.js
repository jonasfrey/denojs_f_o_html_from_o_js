let s_class = 'notifire';
let s_prop_o_js = `o_js__${s_class}`;
let s_uuid_module_scope = crypto.randomUUID();


let f_throw_notification = null;  


let f_o_js__notifire = function(
    a_o_js = [], 
    o_state = {}
){
    let s_uuid_function_scope = crypto.randomUUID();

    // let o_js = {
    //     f_o_jsh: function(){
    //         console.log('render called')
    //         return {
    //             class: [s_class,s_uuid_module_scope,s_uuid_function_scope].join(' '),
    //             a_o: [
    //                 ...o_state?.a_s_notification.map(s=>{
    //                     console.log(s)
    //                     return {
    //                         innerText: s
    //                     }
    //                 })
    //             ]
    //         }
    //     }
    // }
    // let o = Object.assign(
    //     o_state, 
    //     {
    //         //
    //         [s_prop_o_js]: o_js,
    //         //
    //         a_s_notification: [],
    //         // 
    //         s_uuid_module_scope,
    //         s_uuid_function_scope
    //     }
    // )

    // f_throw_notification = function(
    //     s, 
    //     s_type
    // ){
    //     console.log('s')
    //     console.log(s)
    //     console.log(o_state)
    //     o.a_s_notification.push(s);
        
    //     o_js._f_render();
    // }
    // return o_js;

    o_state = Object.assign(
        o_state, 
        {
            s: "this is an example state string in a scope", 
            a_s_not: ['hello'],
        }
    );
        
    let o = {
        a_o: [
            Object.assign(
                o_state, 
                {
                    o_js__a_s_not: {
                        f_o_jsh: ()=>{
                            return {
                                a_o: [
                                    o_state.a_s_not.reverse().map(s=>{
                                        return {
                                            innerText: s
                                        }
                                    })
                                ]
                            }
                        }
                    }
                }
            ).o_js__a_s_not
        ]
    }
    // window.setInterval(
    //     ()=>{
    //         o_state.a_s_not.push(`new notification ${new Date().getTime()}`)
    //         o_state.o_js__a_s_not._f_render()
    //     }
    //     ,1000
    // )
    f_throw_notification = async function(s){
        console.log('htor notif called')
        console.log(s)
        o_state.a_s_not.push(s)
        await o_state.o_js__a_s_not._f_render()
    }

    return o
}
// css for only this module
let s_selector_classscope = `.${[s_class].join('.')}`
let s_selector_modscope = `.${[s_class, s_uuid_module_scope].join('.')}`
// let s_selector_functionscope = `.${[s_class, s_uuid_module_scope, s_uuid_function_scope].join('.')}`
let s_css = `
${s_selector_modscope} .clickable:hover{
    background:red;
}
`
export {
    f_o_js__notifire,
    f_throw_notification, 
    s_css
}