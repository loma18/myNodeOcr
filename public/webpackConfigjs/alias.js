const path = require('path');

const alias = () => ({
    pages: path.resolve(__dirname,'../src/pages/'),
    assets: path.resolve(__dirname,'../src/assets/'),
    components: path.resolve(__dirname,'../src/components/'),
    themes: path.resolve(__dirname,'../src/themes/'),
    utils: path.resolve(__dirname,'../src/utils/'),
    constants: path.resolve(__dirname,'../src/constants/'),
    service: path.resolve(__dirname,'../src/service/'),
    stores: path.resolve(__dirname,'../src/stores/'),
})
module.exports = {alias}