(()=>{const e=document.body.innerHTML,t=/window.tcgcollector[\s]*=[\s]*{[\s]*appState:(.*),[\s]*}/im;if(!t.test(e))return;const d=JSON.parse(document.body.innerHTML.match(t)[1]),i=d.cardIdToCardVariantTypeIdsMap,r=d.idToCardVariantTypeDtoMap,a=document.querySelectorAll("div#card-image-grid div.card-image-grid-item"),n=document.createElement("div");n.setAttribute("id","print"),a.forEach((e=>{const t=e.getAttribute("data-card-id"),d=e.querySelector("a").getAttribute("title").split("(")[0].trim(),a=e.querySelector("span.card-image-grid-item-info-overlay-text-part").innerText.trim();i[t].forEach((e=>{const t=r[e].name,i=document.createElement("div");i.classList.add("placeholder"),i.innerHTML=`<div>${d}</div><div>${a}</div><div>${t}</div>`,n.appendChild(i)}))})),document.body.appendChild(n)})();