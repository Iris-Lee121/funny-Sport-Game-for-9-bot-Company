import {capacity,rank,qualifiers,finalRank} from './core.mjs';
export const groupNumber=n=>{const digits=['','一','二','三','四','五','六','七','八','九'];return n<10?digits[n]:n<20?'十'+digits[n%10]:n<100?digits[Math.floor(n/10)]+'十'+digits[n%10]:String(n)};
const time=t=>Number.isFinite(t)?String(Number(t.toFixed(8))):'';
export const prelimLane=(v,r)=>r.lane+Math.floor((8-v.records.filter(x=>x.heat===r.heat).length)/2);
export function registrationSheets(state,event,stage='heats',heat='all',demo=false){
 const v=state.events[event],final=stage==='final',ranking=final?finalRank(v):rank(v),people=new Map(state.people.map(p=>[p.id,p]));
 const groups=final?[{label:`${event}决赛第一组`,records:qualifiers(v),lanes:8}]:[...new Set(v.records.map(r=>r.heat))].sort((a,b)=>a-b).filter(h=>heat==='all'||h===Number(heat)).map(h=>({label:`${event}第${groupNumber(h)}组`,records:v.records.filter(r=>r.heat===h),lanes:capacity(event)}));
 if(final&&!v.confirmed)throw Error('请先确认预赛晋级，再导出决赛登记表');
 if(!groups.length||!groups.some(g=>g.records.length))throw Error('当前没有可导出的参赛选手');
 const tables=groups.map(g=>{const records=[...g.records].sort((a,b)=>(final?a.finalLane:a.lane)-(final?b.finalLane:b.lane));return {...g,lanes:records.length,columns:records.map(r=>{const p=people.get(r.id),result=ranking.find(x=>x.id===r.id);return {lane:final?r.finalLane:prelimLane(v,r),name:p.name,id:p.id,department:p.department,time:time(final?r.finalTime:r.time),status:(final?r.finalStatus:r.status)==='正常'?'':(final?r.finalStatus:r.status),rank:result?String(final?result.finalRank:result.rank):'',prelim:final?`${r.rank} / ${time(r.time)}`:''}})}});
 const perPage=final?1:2,pages=[];
 for(let i=0;i<tables.length;i+=perPage)pages.push({event,final,demo,tables:tables.slice(i,i+perPage),number:pages.length+1,total:Math.ceil(tables.length/perPage),date:new Date().toLocaleDateString('zh-CN')});
 return pages;
}
export function drawRegistration(canvas,sheet){
 // 3 pixels per PDF point (216 dpi), A4 landscape. All layout dimensions are points.
 canvas.width=2526;canvas.height=1785;const c=canvas.getContext('2d');c.scale(3,3);c.fillStyle='#fff';c.fillRect(0,0,842,595);
 const text=(value,x,y,w,size=11,bold=false)=>{value=String(value??'');c.font=`${bold?'600 ':''}${size}px "PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif`;while(c.measureText(value).width>w&&size>7){size-=.5;c.font=`${bold?'600 ':''}${size}px "PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif`;}c.fillStyle='#17251f';c.textAlign='center';c.textBaseline='middle';c.fillText(value,x+w/2,y,w)};
 text('九号电动第二届员工趣味运动会',30,34,782,20,true);
 text(`项目：${sheet.event.slice(2)}　性别：${sheet.event.slice(0,2)}　${sheet.final?'决赛':'预赛'}成绩登记表　${sheet.date}　单位：秒${sheet.demo?'　（演示）':''}`,30,59,782,10);
 const heights=sheet.final?[25,35,47,28,30,42,28,30]:[22,26,34,22,32,22,25];
 const labels=sheet.final?['道次','姓名','单位','报名编号','预赛名次 / 秒','成绩（秒）','状态','决赛名次']:['道次','姓名','单位','报名编号','成绩（秒）','状态','预赛名次'];
 sheet.tables.forEach((g,index)=>{const top=86+index*236; text(`${g.label}　${g.records.length} 人`,30,top,782,12,true);
 const x=30,y=top+15,labelW=88,colW=(782-labelW)/g.lanes;let rowY=y;
 labels.forEach((label,row)=>{const h=heights[row];c.fillStyle=row===0?'#e7eee9':'#f4f6f4';c.fillRect(x,rowY, row===0?782:labelW,h);text(label,x+3,rowY+h/2,labelW-6,10,true);
 for(let lane=0;lane<g.lanes;lane++){const p=g.columns[lane];const key=sheet.final?['lane','name','department','id','prelim','time','status','rank'][row]:['lane','name','department','id','time','status','rank'][row];const value=row===0?p.lane:p?p[key]:(row===1?'空道':'');text(value,x+labelW+lane*colW+4,rowY+h/2,colW-8,row===1?13:10,row===0||row===1);}
 c.strokeStyle='#68746e';c.lineWidth=.6;c.strokeRect(x,rowY,782,h);for(let lane=0;lane<g.lanes;lane++){c.beginPath();c.moveTo(x+labelW+lane*colW,rowY);c.lineTo(x+labelW+lane*colW,rowY+h);c.stroke();}rowY+=h;
 });
 text('裁判：________________　记录员：________________　比赛时间：________________',30,rowY+14,782,10);
 });
 const note=sheet.final?'决赛排道：按预赛第1至8名依次安排 4、5、3、6、2、7、1、8 道（中间向外）。':'备注：空白成绩供现场填写；状态可填 DNS（未到）、DNF（未完赛）、DQ（犯规）。';
 text(note,30,555,782,9);text(`赛场 FUN SPORTS CLUB　·　第 ${sheet.number} / ${sheet.total} 页`,30,576,782,9);
 return canvas;
}
