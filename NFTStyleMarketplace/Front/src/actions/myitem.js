import axios from 'axios';
import config from '../lib/config';

export async function checkAddress(profileAdd) {
        // ////(profileAdd)
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/checkAddress`,
                        'data': profileAdd
                })
                // ////(checkAddr.data)
                return {
                        data: checkAddr.data
                }


        }
        catch (err) {
                return {
                        error: err
                }
        }
}
// wrote in the create.controller
export const changeStatus = async (data) => {
        //("EWrwrwerwerewrwerwe" + JSON.stringify(data))
        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/changeStatus`,

                        data
                });

                return {
                        loading: false,
                        userValue: respData.data
                }
        }
        catch (err) {
                return {
                        loading: false,
                        error: err.response.data.err
                }
        }
}

export const deleteTokenVal = async (data) => {
        // ////("data*****************************" + JSON.stringify(data))
        try {
                let respData = await axios({
                        'method': 'get',
                        'url': `${config.Back_URL}/create/deleteTokenVal/${data}`,

                });

                return {

                        data: respData.data
                }
        }
        catch (err) {
                return {
                        loading: false,
                        error: err.response.data
                }
        }
}

export const autosaveAddress2 = async (data) => {

        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/autosaveAddress2`,
                        data: data
                });

                return {
                        loading: false,
                        userValue: respData.data
                }
        }
        catch (err) {
                return {
                        loading: false,
                        error: err.response
                }
        }
}
export const autosaveAddress1 = async (data) => {
        // ////("datra" + JSON.stringify(data))

        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/autosaveAddress1`,
                        data
                });

                return {
                        loading: false,
                        userValue: respData.data
                }
        }
        catch (err) {
                return {
                        loading: false,
                        error: err.response
                }
        }
}
export const followCheck = async (data) => {
        ////("datra" + JSON.stringify(data))

        try {
                let respData = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/followCheck/${data.currAdrr}`,

                });

                return {

                        userValue: respData.data
                }
        }
        catch (err) {
                return {

                        error: err.response.data
                }
        }
}
export async function onSaledata1(profileAdd) {
        // ////("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/onSaledatas`,
                        'data': profileAdd
                })
                return {
                        data: checkAddr.data
                }
                // ////(checkAd)

        }
        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function onFollowerCount(profileAdd) {
        // ////("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/onFollower`,
                        'data': profileAdd
                })
                return {
                        data: checkAddr.data
                }
                // ////(checkAd)

        }
        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function onActivityCount(profileAdd) {
        // ////("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/onActivity`,
                        'data': profileAdd
                })
                return {
                        data: checkAddr.data
                }
                // ////(checkAd)

        }
        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function onFollowingCount(profileAdd) {
        // ////("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/onFollowing`,
                        'data': profileAdd
                })
                return {
                        data: checkAddr.data
                }
                // ////(checkAd)

        }
        catch (err) {
                return {
                        error: err.response
                }
        }
}

export async function collectibledata(profileAdd) {
        // ////("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/collectibledata`,
                        'data': profileAdd
                })
                return {
                        data: checkAddr.data
                }
                // ////(checkAd)

        }
        catch (err) {
                return {
                        // error: err.response.data
                }
        }
}

export async function creatorVal(profileAdd) {
        //("profileAdd2122222222222222" + JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/creatorVal`,
                        'data': profileAdd
                })
                //("profileAdd2122222222222222" + JSON.stringify(checkAddr.data))
                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function checkCreator(profileAdd) {
        //("profileAdd" + JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/checkCreator`,
                        'data': profileAdd
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function checkOwner(profileAdd) {
        //("profileAdd" + JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/checkOwner`,
                        'data': profileAdd
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function pics(addr) {
        //("profileAdd122" + JSON.stringify(addr))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/pics`,
                        'data': addr
                })
                //("profileAdd122" + JSON.stringify(checkAddr.data))
                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        // error: err.response.data
                }
        }
}



export async function statusfollowFunction(data) {
        ////("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/statusfollowFunction`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function followFunction(data) {
        ////("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/followFunction`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function getfollowFunction(data) {
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/getfollowFunction`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }

}

export async function unfollowFunction(data) {
        ////("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/unfollowFunction`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function getfollowerDetail(data) {
        ////("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/followerDetails`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function getfollowingDetail(data) {
        ////("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/followingDetails`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}

export async function getActivityDetail(data) {
        ////("profileAdd"+JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/activityDetails`,
                        'data': data
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function checkOwnerfromparam(profileAdd) {
        //("profileAdd" + JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/checkOwnerfromparam`,
                        'data': profileAdd
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}
export async function checkCreatorfromparam(profileAdd) {
        //("profileAdd" + JSON.stringify(profileAdd))
        try {
                let checkAddr = await axios({
                        'method': 'post',
                        'url': `${config.Back_URL}/user/checkOwnerfromparam`,
                        'data': profileAdd
                })

                return {
                        data: checkAddr.data
                }

        }

        catch (err) {
                return {
                        error: err.response
                }
        }
}