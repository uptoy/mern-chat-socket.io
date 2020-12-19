const users = []

//user入室
const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    const existingUser = users.find((user) => user.room === room && user.name === name)
    //同名usernameがいた場合
    if (existingUser) {
        return { error: 'username is taken' }
    } else {
        //新しいuser情報を配列にpushする
        const user = { id, name, room }
        users.push(user)
        //どのuseがいるかを返す
        return { user }
    }
}

//user退室
const removeUser = (id) => {
    //findIndex 配列に要素が見つからなかった場合返り値-1を返す
    const index = users.findIndex((user) => user.id === id)
    // ["john", "ken", "mike"]
    //ユーザーがいれば
    if (index !== -1) {
        // // ken
        // //index === 1
        // const removedUsers = users.splice(index, 1)
        // // removedUsers = ["ken"]
        // console.log(removedUsers)
        // return removeUsers[0]　//ken
        return users.splice(index, 1)[0] //取り除かれた要素が返り値として返される
    }
}

//user情報取得
const getUser = (id) => users.find((user) => user.id === id)

//usersroom情報取得
const getUsersInRoom = (room) => users.filter((user) => user.room === room)

module.exports = { addUser, removeUser, getUser, getUsersInRoom }