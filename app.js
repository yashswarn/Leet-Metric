document.addEventListener("DOMContentLoaded",function(){
    const searchButton=document.getElementById("search-btn");
    const userInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress ");
    const mediumProgressCircle=document.querySelector(".medium-progress ");
    const hardProgressCircle=document.querySelector(".hard-progress ");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardStatsContainer=document.querySelector(".stats-card");


    function validateUsername(username){
        if (username.trim()==='') {
            alert("user name should not be empty");
            return false;
        }

        const regex=/^[a-zA-Z0-9_-]{1,15}$/;

        const isMatching=regex.test(username);
        if(!isMatching){
            alert("invalid username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username){
    
    try{

    searchButton.textContent="loading...";
    searchButton.disabled=true;
    // statsContainer.style.setProperty("display",hidden)
    // statsContainer.classList.add("hidden");

    const proxyUrl = 'https://cors-anywhere.herokuapp.com/' 
    const targetUrl = 'https://leetcode.com/graphql/';
    // const targetUrl='https://leetcode.com/{username}/'
    // const targetUrl='https://leetcode-api.onrender.com/${username}'
    // const targetUrl='https://alfa-leetcode-api.onrender.com/userProfile/{username}'
    // const targetUrl='https://alfa-leetcode-api.onrender.com/'

    const myHeaders=new Headers();
    myHeaders.append("content-type","application/json");

    const graphql = JSON.stringify({
        query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",      
        variables: { "username": username}    })

    const requestOptions={
        method:"GET",
        headers:myHeaders,
        body:graphql,
        redirect:"follow"
    };

    const response=await fetch(proxyUrl+targetUrl,requestOptions);
    // const response = await fetch(`http://localhost:5000/leetcode/${username}`);

    if(!response.ok){
        throw new Error("unable to fetch user details");
    }
    const parsedData=await response.json();
    console.log("logging data by me:",parsedData);

    displayUserData(parsedData);
        
    }

    catch(error){
        statsContainer.innerHTML=`<p>no data found</p>`;
    }

    // finally{
    //     searchButton.textContent="search";
    //     searchButton.disabled=false;
    // }

}

function updateProgress(solved,total,label,circle){
    const progressDegree=(solved/total)*100;
    circle.style.setProperty("--progress-degree",`${progressDegree}%`);
    label.textContent=`${solved}/${total}`;
}

// my changes applied here

function updateProgress(solved){
    circle.style.setProperty("--progress-degree",`${progressDegree}%`);
    label.textContent=`${solved}`;
    circle.textContent=`${solved}`
}



function displayUserData(parsedData){
    const totalQues=parsedData.data.allQuestionsCount[0].count;
    const totalEasyQues=parsedData.data.allQuestionsCount[1].count;
    const totalMediumQues=parsedData.data.allQuestionsCount[2].count;
    const totalHardQues=parsedData.data.allQuestionsCount[3].count;

    const solvedTotalQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
    const solvedTotalEasyQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
    const solvedTotalMediumQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
    const solvedTotalHardQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

    updateProgress(solvedTotalEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
    updateProgress(solvedTotalMediumQues,totalMediumQues,mediumLabel,mediumProgressCircle);
    updateProgress(solvedTotalHardQues,totalHardQues,hardLabel,hardProgressCircle);

    updateProgress(solvedTotalEasyQues);
    updateProgress(solvedTotalMediumQues);
    updateProgress(solvedTotalHardQues);

    const cardsData=[
        {label:"Overall Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
        {label:"Overall Easy Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
        {label:"Overall Medium Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
        {label:"Overall Hard Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions}

    ];

    console.log("card ka data:",cardsData);

    cardStatsContainer.innerHTML=cardsData.map(
        data=>
            `<div class="card">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
             </div>`
    ).join("")
}

searchButton.addEventListener("click",function(){
    const username=userInput.value;
    console.log("logging username:",username);
    if(validateUsername(username)){
        fetchUserDetails(username);        
    }
    });
});
