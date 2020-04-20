module.exports = (app) => {

    app.get('/start',(req,res)=>{
        res.sendStatus(200);
    })
}
