function parse(args) {
    if(!args.includes('-')){
        return { default: args}
    }
    const paramArray = args.split('-');
    const paramObject = {};
   paramArray.filter((cp) => cp!= '').map((passedInParam) => {
        const parseBreakIndex =  passedInParam.indexOf(' ')
        let paramName = '';
        let value = '';
        if(parseBreakIndex == -1){
            paramName = passedInParam;
        }
        else{
            paramName = passedInParam.substring(0, parseBreakIndex);
            value = passedInParam.replace(`${paramName} `, '');
        }

        if(value == ''){
            paramObject[paramName] = true;
        }
        else{
            paramObject[paramName] = value.trim();
        }
    })
    return paramObject
}

module.exports = parse;