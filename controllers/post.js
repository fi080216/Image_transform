function post(){
    return{
        upload(req,res){
            const fileId = req.file.filename;
            res.render("main", { fileId : fileId});

        }

    }
}

module.exports = post;