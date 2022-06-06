import * as Blog from "./js/blog.js"
import * as Push from "../ressources/module/push/push-module.js";


function SetUp() {
    document.querySelector("#loader-hide").id = "loader";
    console.log("setting up..");
    Blog.getAllArticles()
        .then((ArticleList) => {
            const MainContainer = document.querySelector("#allArticle");
            /*for (let i = 0; i < Object.keys(ArticleList).length; i++) {
                var CurrentCategorie = document.createElement("div");
                const cname = ArticleList[Object.keys(ArticleList)[i]].name;
                    CurrentCategorie.id = cname;
                    CurrentCategorie.className = "categorie";
                        for (let j = 0; j < (Object.keys(ArticleList[cname]).length-1); j++) {
                            const name = ArticleList[cname][Object.keys(ArticleList[cname])[j]].Name;   
                            const Article = document.createElement("div");
                            Article.id = name;
                            Article.className = "card";
                        
                            CurrentCategorie.appendChild(Article);
                            
                        }
                MainContainer.appendChild(CurrentCategorie);
            }*/
            var Categories = [];
            for (let i = 0; i < Object.keys(ArticleList).length; i++) {
                var u = ArticleList[Object.keys(ArticleList)[i]].Name;
                var CurrentCategorie;
                var CategorieContent;
                if (!Categories.includes(ArticleList[u].categorie, [0])) {
                    CurrentCategorie = document.createElement("div");
                    CurrentCategorie.id = ArticleList[u].categorie;
                    CurrentCategorie.className = "categorie";
                    const CategorieName = document.createElement("div");
                    CategorieName.className = "name";
                    const CategorieNameText = document.createElement("p");
                    CategorieNameText.innerHTML = ArticleList[u].categorie.split('_').join(' ');
                    CategorieName.appendChild(CategorieNameText);

                    CurrentCategorie.appendChild(CategorieName);
                    /*const Hbar = document.createElement("div");
                    Hbar.className = "horizontal-bar";
                    CurrentCategorie.appendChild(Hbar);*/

                    CategorieContent = document.createElement("div");
                    CategorieContent.className = "Maincontent";
                    CurrentCategorie.appendChild(CategorieContent);

                    Categories.push(ArticleList[u].categorie);
                } else {
                    CurrentCategorie = document.querySelector("#" + ArticleList[u].categorie);
                    CategorieContent = CurrentCategorie.querySelector("." + "Maincontent")
                }
                const Article = document.createElement("div");
                Article.id = ArticleList[u].Name;
                Article.className = "card";
                const ArticleContent = document.createElement("div");
                ArticleContent.className = "content"
                const ACTitle = document.createElement("div");
                ACTitle.className = "article-title";
                const ACTitleText = document.createElement("p");
                ACTitleText.innerHTML = ArticleList[u].Name.split('_').join(' ');
                ACTitle.appendChild(ACTitleText);
                ArticleContent.appendChild(ACTitle)
                var g = ArticleList[u].Name;
                Blog.GetDownloadUrl(ArticleList[u].Name)
                .then((Url) => {
                    console.log(Url);
                    if(Url){
                        Article.style.backgroundImage = "url(" + Url + ")";
                    }
                    
                })
                
                Article.setAttribute("onClick","window.location = './blog/" + g + "'")
                Article.appendChild(ArticleContent);

                CategorieContent.appendChild(Article);


                MainContainer.appendChild(CurrentCategorie);
            }
            document.querySelector("#loader").id = "loader-hide";
        })
        .catch((err)=>{
            console.log(err);
            Push.PushUp(3,err)
        })
}

SetUp();