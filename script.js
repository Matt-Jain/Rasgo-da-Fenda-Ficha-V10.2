let characters = [];
let editing = null;

const skillList = [
 "Luta Corpo a Corpo","Armas Brancas","Armas de Fogo","Esquiva",
 "Percepção","Investigação","Ocultismo","Intuição",
 "Atletismo","Furtividade","Resistência",
 "Persuasão","Enganação","Intimidação","Empatia",
 "Acrobacia","Conhecimento","Diplomacia"
];

let skills = {};
let points = 0;

function enterApp(){
  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");
  show("menu");
}

function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function initSkills(){
  skills = {};
  skillList.forEach(s=>skills[s]=20);
  points = 200 - skillList.length*20;
}

function renderSkills(){
  skillsDiv = document.getElementById("skills");
  skillsDiv.innerHTML="";
  skillList.forEach(s=>{
    let div=document.createElement("div");
    div.className="skill";
    div.innerHTML=`
      ${s}
      <button onclick="modSkill('${s}',-1)">-</button>
      ${skills[s]}
      <button onclick="modSkill('${s}',1)">+</button>
    `;
    skillsDiv.appendChild(div);
  });
  pointsSpan.innerText=points;
}

function modSkill(skill,val){
  if(val>0 && points<=0) return;
  if(val<0 && skills[skill]<=20) return;
  skills[skill]+=val;
  points-=val;
  renderSkills();
}

function saveCharacter(){
  const data={
    name:charName.value,
    appearance:appearance.value,
    history:history.value,
    goal:goal.value,
    skills:{...skills},
    race:"Não Desperto",
    trait:"",
    life:100,
    sanity:100,
    aura:50,
    control:0
  };

  if(editing!==null) characters[editing]=data;
  else characters.push(data);

  editing=null;
  renderCharacters();
  show("characters");
}

function renderCharacters(){
  charList.innerHTML="";
  diceChar.innerHTML="";
  characters.forEach((c,i)=>{
    let div=document.createElement("div");
    div.innerHTML=`
      <b>${c.name}</b> (${c.race})
      <button onclick="edit(${i})">Editar</button>
      <button onclick="awaken(${i})">Despertar</button>
    `;
    charList.appendChild(div);

    let opt=document.createElement("option");
    opt.value=i; opt.text=c.name;
    diceChar.appendChild(opt);
  });
}

function awaken(i){
  const roll=Math.floor(Math.random()*100)+1;
  const c=characters[i];

  if(roll<=60){
    c.race="Aureado";
    c.trait="Eco da Luz";
    c.skills["Percepção"]+=15;
    c.skills["Intuição"]+=15;
    c.skills["Resistência"]+=10;
    c.skills["Luta Corpo a Corpo"]+=10;
  } else if(roll<=90){
    c.race="Vigilante";
    c.trait="Presença Inata";
    c.skills["Luta Corpo a Corpo"]+=20;
    c.skills["Ocultismo"]+=20;
    c.skills["Resistência"]+=15;
    c.skills["Intimidação"]+=10;
  } else {
    c.race="Nephilim";
    c.trait="Dualidade Instável";
    c.skills["Luta Corpo a Corpo"]+=25;
    c.skills["Intimidação"]+=25;
    c.skills["Ocultismo"]+=20;
    c.skills["Resistência"]+=20;
  }

  renderCharacters();
}

function rollDice(){
  const c=characters[diceChar.value];
  diceSkill.innerHTML="";
  Object.keys(c.skills).forEach(s=>{
    let o=document.createElement("option");
    o.value=s; o.text=s;
    diceSkill.appendChild(o);
  });

  const roll=Math.floor(Math.random()*100)+1;
  const skill=diceSkill.value;
  diceResult.innerHTML=`Rolagem: ${roll}<br>
  Perícia (${skill}): ${c.skills[skill]}<br>
  ${roll<=c.skills[skill]?"SUCESSO":"FALHA"}`;
}
