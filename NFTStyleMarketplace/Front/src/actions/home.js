import axios from "axios";
import config from '../lib/config';


export const allProfileUser = async (datas) => {
        //('vanthutan+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ' + datas.skip + " sasfgsadgsfagasg " + datas.limit);

        try {

                let resp1Data = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/allProfileUser`,
                        data: datas

                });
                // //("ella edu"+JSON.stringify(resp1Data.data))
                return {

                        data: resp1Data.data

                }

        }
        catch (e) {

        }
}
export const liveauction = async (data) => {
        // //('vanthutan+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ' + datas.skip + " sasfgsadgsfagasg " + datas.limit);

        try {

                let resp1Data = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/liveauction`,
                        data:data

                });
                //("ella edu"+JSON.stringify(resp1Data.data))
                return {

                        data: resp1Data.data

                }

        }
        catch (e) {

        }
}
export const addLike = async (data) => {
        //("ckee" + JSON.stringify(data))
        var tokenCounts = data.tokenCounts

        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/addLike`,
                        data: data

                });
                //("ssssssss" + respData.data.bool)
                return {

                        data: respData.data
                }
        }
        catch (err) {
                return {
                        // error: err.response.data
                }
        }
}

//liked data
//add Like
export const getLikeData = async (data) => {
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/create/getLikeData`,
                        data: data

                });
                //("ssssssss" + respData.data.bool)
                return {

                        data: respData.data
                }
        }
        catch (err) {
                return {
                        // error: err.response.data
                }
        }
}

