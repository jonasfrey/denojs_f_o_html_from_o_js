let f_o_jsh__select = function(
    o,
    s_name_prop_value,  
    a_v, 
    f_s_innerText = (v)=>{JSON.stringify(v)}, 
){
    return {
        s_tag: "select",
        class: `a_${s_name_prop_value}`,
        oninput: function(o_e){
            // console.log(o_e.target.value)
            o[s_name_prop_value] = a_v[o_e.target.value]
        },
        a_o: [
            ...a_v.map(
                (v, n_idx)=>{
                    return Object.assign({
                        
                        s_tag: "option", 
                        value: n_idx, 
                        innerText: f_s_innerText(v)
                    },
                    ...[(v == o[s_name_prop_value])? {selected: true}:{}]
                    )
                }
            )
        ]
    }
}
export {
    f_o_jsh__select
}