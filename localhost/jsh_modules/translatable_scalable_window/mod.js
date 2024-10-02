import {
    O_vec2
} from "https://deno.land/x/vector@0.8/mod.js"
import {
    f_o_trn__relative_to_o_html
} from "../functions.module.js"


let f_update_pointerdown = function(o_state,o_e){
    o_state.o_pd = {n_x: o_e.clientX, n_y: o_e.clientY}
    o_state.o_scl_pd = Object.assign({}, o_state.o_scl)
    o_state.o_trn_pd = Object.assign({}, o_state.o_trn)
}
let f_update_pointerdown_scl = function(o_state, o_e){
    o_state.b_scale = true;
    f_update_pointerdown(o_state, o_e);
}
let f_update_pointerdown_trn = function(o_state, o_e){
    o_state.b_translate = true;
    f_update_pointerdown(o_state,o_e);
}


let s_class = 'overlay_window';
let s_uuid_mod_scope = crypto.randomUUID();
let f_o_js = function(
    a_o_js = [], 
    o_state = {}
){
    let s_uuid_func_scope = crypto.randomUUID(); 
    let a_s_class = [s_class, s_uuid_mod_scope, s_uuid_func_scope]
    let o1 = {
        o_scl: (o_state?.o_scl) ? o_state.o_scl : {n_x: 100, n_y: 100},
        o_trn: (o_state?.o_trn) ? o_state.o_trn : {n_x: 100, n_y: 100},
    };
    let o = Object.assign(
        {
            
            b_render: true, 
            b_scale: false, 
            b_translate: false,
            o_pd: {n_x: 0, n_y:0}, 
            o_scl: o1.o_scl,
            o_trn: o1.o_trn, 
            o_scl_pd: Object.assign({}, o1.o_scl),
            o_trn_pd: Object.assign({}, o1.o_trn),
            s_style: 'border-radius: 3px', 
            s_class: '',
        }, 
        o_state
    )
    let f_o_assigned = function(s, o, o2){
        return Object.assign(
            o2, 
            {
                [s]: o
            }
        )[s]
    }
    window.onpointerup = function(){
        o_state.b_scale = false;
        o_state.b_translate = false;
    }
    window.onpointermove = async function(o_e){
        
        let n_x_p_nor = (o_e.clientX - o_state.o_trn.n_x)/o_state.o_scl.n_x;
        let n_y_p_nor = (o_e.clientY - o_state.o_trn.n_y)/o_state.o_scl.n_y;

        let o_diff_scl_x = o_state.o_pd.n_x - o_e.clientX;
        let o_diff_scl_y = o_state.o_pd.n_y - o_e.clientY;
        let o_diff_trn_x = o_state.o_trn_pd.n_x - o_e.clientX;
        let o_diff_trn_y = o_state.o_trn_pd.n_y - o_e.clientY;
        
        let o_diff_trn_x2 = o_state.o_trn_pd.n_x - o_state.o_pd.n_x;
        let o_diff_trn_y2 = o_state.o_trn_pd.n_y - o_state.o_pd.n_y;

        let o_diff_scl_x2 = o_state.o_scl_pd.n_x - o_state.o_pd.n_x;
        let o_diff_scl_y2 = o_state.o_scl_pd.n_y - o_state.o_pd.n_y;
        
        if(o_state.b_scale){
            let n_factor_x = (n_x_p_nor > .5) ? -1 : 1;
            let n_factor_y = (n_y_p_nor > .5) ? -1 : 1;
            o_state.o_scl.n_x = o_state.o_scl_pd.n_x+n_factor_x*o_diff_scl_x;
            o_state.o_scl.n_y = o_state.o_scl_pd.n_y+n_factor_y*o_diff_scl_y;
            if(n_x_p_nor < .5){
                o_state.o_trn.n_x = o_state.o_trn_pd.n_x-o_diff_trn_x+o_diff_trn_x2; 
            }
            if(n_y_p_nor < .5){
                o_state.o_trn.n_y = o_state.o_trn_pd.n_y-o_diff_trn_y+o_diff_trn_y2; 
            }
            await o_state.o_js._f_update();
        }
        if(o_state.b_translate){
            o_state.o_trn.n_x = o_state.o_trn_pd.n_x-o_diff_trn_x+o_diff_trn_x2;
            o_state.o_trn.n_y = o_state.o_trn_pd.n_y-o_diff_trn_y+o_diff_trn_y2;
            await o_state.o_js._f_update();
        }

    }


    let o_js = f_o_assigned(
        'o_js', 
        {
            f_o_jsh: async ()=>{
                console.log('asdf')
                return {
                    b_render: o_state.b_render,
                    class: [
                        o_state.s_class,
                        ...a_s_class,
                    ].join(' '),
                    style: [
                        `position: absolute`, 
                        `left: ${o_state.o_trn.n_x}px`,
                        `top:${o_state.o_trn.n_y}px`, 
                        `width:${o_state.o_scl.n_x}px`,
                        `height: ${o_state.o_scl.n_y}px`,
                        o_state.s_style 
                    ].join(';'), 
                    a_o: [
                        ...a_o_js
                        // {innerText: "drag me"}, 
                        // {
                        //     s_tag: "button", 
                        //     innerText: "translate", 
                        //     onpointerdown: (o_e)=>{
                        //         f_update_pointerdown_trn(o_e);
                        //     }
                        // },
                        // {
                        //     s_tag: "button", 
                        //     innerText: "scale",
                        //     onpointerdown: (o_e)=>{
                        //         f_update_pointerdown_scl(o_e);
                        //     }
                        // }
                    ]
                }
            }
        },
       o_state 
    )

    return o_js;


}

export {
    f_update_pointerdown_scl,
    f_update_pointerdown_trn,
    f_o_js, 
}