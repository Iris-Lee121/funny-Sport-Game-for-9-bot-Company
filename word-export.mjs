import {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,AlignmentType,VerticalAlign,PageOrientation,HeightRule,BorderStyle,PageBreak,Footer,PageNumber} from './docx-lib.mjs';
const title='九号电动第二届员工趣味运动会';
export async function registrationWord(sheets){
 const paragraph=(text,size=20,bold=false,extra={})=>new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:60,line:240},...extra,children:[new TextRun({text:String(text??''),size,bold,color:'000000',font:'Microsoft YaHei'})]});
 const border={style:BorderStyle.SINGLE,size:4,color:'A6AEA9'},children=[];
 sheets.forEach((sheet,index)=>{

 children.push(paragraph(title,32,true,{style:'Title',pageBreakBefore:index>0,spacing:{after:100}}));
 children.push(paragraph(`项目：${sheet.event.slice(2)}　性别：${sheet.event.slice(0,2)}　${sheet.final?'决赛':'预赛'}成绩登记表　${sheet.date}　成绩单位：秒${sheet.demo?'　演示数据':''}`,18,false,{spacing:{after:100}}));
 sheet.tables.forEach(g=>{
 children.push(paragraph(`${g.label}　${g.records.length} 人`,23,true,{keepNext:true,spacing:{before:80,after:80}}));
 const labels=sheet.final?['道次','姓名','单位','报名编号','预赛名次 / 秒','成绩（秒）','状态','决赛名次']:['道次','姓名','单位','报名编号','成绩（秒）','状态','预赛名次'];
 const keys=sheet.final?['lane','name','department','id','prelim','time','status','rank']:['lane','name','department','id','time','status','rank'];
 const widths=[1250,...g.columns.map(()=>Math.floor((15128-1250)/g.columns.length))];widths[widths.length-1]+=15128-widths.reduce((a,b)=>a+b,0);
 children.push(new Table({width:{size:15128,type:WidthType.DXA},columnWidths:widths,layout:'fixed',borders:{top:border,bottom:border,left:border,right:border,insideHorizontal:border,insideVertical:border},rows:labels.map((label,row)=>new TableRow({cantSplit:true,height:{value:row===2?480:row===4?460:340,rule:HeightRule.ATLEAST},children:[label,...g.columns.map(p=>p[keys[row]])].map((value,col)=>new TableCell({width:{size:widths[col],type:WidthType.DXA},verticalAlign:VerticalAlign.CENTER,shading:row===0?{fill:'E7EEE9'}:col===0?{fill:'F3F5F3'}:undefined,margins:{top:60,bottom:60,left:65,right:65},children:[paragraph(value,row===1?23:19,col===0||row<2,{spacing:{after:0,line:240},keepNext:false})]}))}))}));
 children.push(paragraph('裁判：________________　记录员：________________　比赛时间：________________',18,false,{spacing:{before:80,after:100}}));
 });
 children.push(paragraph(sheet.final?'决赛排道按预赛成绩由快到慢对应 4、5、3、6、2、7、1、8 道。':'状态可填 DNS（未到）、DNF（未完赛）、DQ（犯规）。空白成绩供现场填写。',16,false,{spacing:{before:80,after:0}}));
 });
 const doc=new Document({creator:'赛事工作台',title,description:'可编辑的横版运动会成绩登记表',styles:{default:{document:{run:{font:'Microsoft YaHei',size:20,color:'000000'},paragraph:{spacing:{after:0}}}}},sections:[{properties:{page:{size:{width:11906,height:16838,orientation:PageOrientation.LANDSCAPE},margin:{top:520,bottom:520,left:855,right:855,header:200,footer:250}}},footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'九号电动员工趣味运动会　',size:16}),new TextRun({children:['第 ',PageNumber.CURRENT,' 页'],size:16})]})]})},children}]});
 return new Uint8Array(await Packer.toArrayBuffer(doc));
}
