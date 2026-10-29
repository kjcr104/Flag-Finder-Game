require([
"esri/WebMap",
"esri/views/MapView",
"esri/layers/FeatureLayer",
"esri/Graphic"
], function(
WebMap,
MapView,
FeatureLayer,
Graphic
){

const EASY_MAP =
"40e4d7b08b084158938349610cf9ffa3";

const HARD_MAP =
"3c343d438f2949008f0f7575cd7546cc";

let difficulty="";
let score=0;
let round=1;
let guesses=0;

let currentQuestion=null;
let gameQuestions=[];
let gameResults=[];

const MAX_ROUNDS=5;

const countries=[

{
country:"Australia",
flag:"https://flagcdn.com/w320/au.png",
capital:"Canberra",
population:"27 Million",
area:"7.69 Million km²",
fact:"Australia is home to more kangaroos than people."
},

{
country:"Brazil",
flag:"https://flagcdn.com/w320/br.png",
capital:"Brasilia",
population:"216 Million",
area:"8.51 Million km²",
fact:"Brazil contains around 60% of the Amazon rainforest."
},

{
country:"Canada",
flag:"https://flagcdn.com/w320/ca.png",
capital:"Ottawa",
population:"41 Million",
area:"9.98 Million km²",
fact:"Canada has the longest coastline in the world."
},

{
country:"France",
flag:"https://flagcdn.com/w320/fr.png",
capital:"Paris",
population:"68 Million",
area:"551,695 km²",
fact:"France is one of the world's most visited countries."
},

{
country:"Germany",
flag:"https://flagcdn.com/w320/de.png",
capital:"Berlin",
population:"84 Million",
area:"357,022 km²",
fact:"Germany has more than 20,000 castles."
},

{
country:"India",
flag:"https://flagcdn.com/w320/in.png",
capital:"New Delhi",
population:"1.4 Billion",
area:"3.29 Million km²",
fact:"India is the world's most populous country."
},

{
country:"Italy",
flag:"https://flagcdn.com/w320/it.png",
capital:"Rome",
population:"59 Million",
area:"301,340 km²",
fact:"Italy has more UNESCO sites than any other country."
},

{
country:"Japan",
flag:"https://flagcdn.com/w320/jp.png",
capital:"Tokyo",
population:"124 Million",
area:"377,975 km²",
fact:"Japan consists of thousands of islands."
},

{
country:"Kenya",
flag:"https://flagcdn.com/w320/ke.png",
capital:"Nairobi",
population:"55 Million",
area:"580,367 km²",
fact:"Kenya is famous for the Great Migration."
},

{
country:"Spain",
flag:"https://flagcdn.com/w320/es.png",
capital:"Madrid",
population:"49 Million",
area:"505,990 km²",
fact:"Spain produces nearly half of the world's olive oil."
}

];

const countriesLayer = new FeatureLayer({
url:"https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries/FeatureServer/0",
outFields:["*"],
renderer:{
type:"simple",
symbol:{
type:"simple-fill",
color:[0,0,0,0],
outline:{
color:[0,0,0,0],
width:0
}
}
}
});

let map = new WebMap({
portalItem:{
id:EASY_MAP
}
});

map.add(countriesLayer);

const view = new MapView({
container:"viewDiv",
map:map,
center:[10,20],
zoom:3.5
});

function switchMap(mode){

const id =
mode==="Easy"
? EASY_MAP
: HARD_MAP;

const newMap = new WebMap({
portalItem:{
id:id
}
});

newMap.add(countriesLayer);

view.map = newMap;
}

function scoreForGuess(guess){

if(guess>=10){
return 100;
}

return 1100-(guess*100);
}

function shuffle(array){

for(let i=array.length-1;i>0;i--){

const j=
Math.floor(
Math.random()*(i+1)
);

[array[i],array[j]]=
[array[j],array[i]];
}

return array;
}

function setupGame(){

score=0;
round=1;

gameResults=[];

gameQuestions=
shuffle([...countries])
.slice(0,MAX_ROUNDS);

loadQuestion();
}

function loadQuestion(){

view.graphics.removeAll();

guesses=0;

currentQuestion=
gameQuestions[round-1];

document.getElementById("roundLabel").innerText=
`${round}/${MAX_ROUNDS}`;

document.getElementById("scoreLabel").innerText=
score;

document.getElementById("flag").src=
currentQuestion.flag;

document.getElementById("status").innerHTML=
"Click the matching country.";

document.getElementById("skipBtn").classList.remove("hidden");
document.getElementById("nextBtn").classList.add("hidden");
}

function showFacts(points,title,cssClass){

document.getElementById("status").innerHTML=
`
<div class="${cssClass}">
${title}
</div>

<div class="infoCard">

<h2>${currentQuestion.country}</h2>

<p><strong>Capital:</strong> ${currentQuestion.capital}</p>

<p><strong>Population:</strong> ${currentQuestion.population}</p>

<p><strong>Area:</strong> ${currentQuestion.area}</p>

<p><strong>Fun Fact:</strong> ${currentQuestion.fact}</p>

<p><strong>Round Score:</strong> ${points}</p>

</div>
`;

document.getElementById("skipBtn").classList.add("hidden");
document.getElementById("nextBtn").classList.remove("hidden");
}

function finishGame(){

let total=0;
let answered=0;

let html=`
<h2>Final Score: ${score}</h2>
<hr>
<h3>Round Breakdown</h3>
`;

gameResults.forEach(result=>{

html+=`
<p>
<strong>${result.country}</strong>:
${result.guesses}
</p>
`;

if(typeof result.guesses==="number"){

total+=result.guesses;
answered++;
}

});

const avg=
answered>0
? (total/answered).toFixed(1)
: 0;

html+=`
<hr>
<p><strong>Total Guesses:</strong> ${total}</p>
<p><strong>Average Guesses:</strong> ${avg}</p>
`;

document.getElementById("gameScreen").classList.add("hidden");
document.getElementById("resultScreen").classList.remove("hidden");

document.getElementById("results").innerHTML=
html;
}

document.getElementById("easyBtn").onclick=()=>{

difficulty="Easy";

switchMap("Easy");

document.getElementById("difficultyLabel").innerText=
"Easy";

document.getElementById("startScreen").classList.add("hidden");
document.getElementById("gameScreen").classList.remove("hidden");

setupGame();
};

document.getElementById("hardBtn").onclick=()=>{

difficulty="Hard";

switchMap("Hard");

document.getElementById("difficultyLabel").innerText=
"Hard";

document.getElementById("startScreen").classList.add("hidden");
document.getElementById("gameScreen").classList.remove("hidden");

setupGame();
};

document.getElementById("nextBtn").onclick=()=>{

round++;

if(round>MAX_ROUNDS){

finishGame();
return;
}

loadQuestion();
};

document.getElementById("restartBtn").onclick=()=>{

location.reload();
};

document.getElementById("skipBtn").onclick=()=>{

gameResults.push({
country:currentQuestion.country,
guesses:"Skipped"
});

showFacts(
0,
"ANSWER REVEALED",
"incorrect"
);
};

view.on("click",function(event){

view.hitTest(event).then(function(response){

const hit=
response.results.find(
r=>r.graphic.layer===countriesLayer
);

if(!hit)return;

const selectedCountry=
hit.graphic.attributes.COUNTRY;

guesses++;

if(
selectedCountry.toLowerCase()===
currentQuestion.country.toLowerCase()
){

view.graphics.removeAll();

view.graphics.add(
new Graphic({
geometry:hit.graphic.geometry,
symbol:{
type:"simple-fill",
color:[0,255,0,0.3],
outline:{
color:[255,255,255,1],
width:2
}
}
})
);

const roundScore=
scoreForGuess(guesses);

score+=roundScore;

gameResults.push({
country:currentQuestion.country,
guesses:guesses
});

document.getElementById("scoreLabel").innerText=
score;

showFacts(
roundScore,
"CORRECT",
"correct"
);

}else{

view.graphics.removeAll();

view.graphics.add(
new Graphic({
geometry:hit.graphic.geometry,
symbol:{
type:"simple-fill",
color:[255,0,0,0.4],
outline:{
color:[255,255,255,1],
width:2
}
}
})
);

document.getElementById("status").innerHTML=
`
<div class="incorrect">
INCORRECT

<br><br>

Attempts: ${guesses}
</div>
`;
}

});

});

});
