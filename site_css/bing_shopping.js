//背景の白色がID指定かつimportantされているので、挿入cssでは背景を消せない。そこで、スクリプトを用いて無理矢理背景を消す。
document.getElementById("resultsContainer").style.setProperty("background-color", "transparent", "important");
Array.prototype.forEach.call(document.getElementsByClassName("br-card"), (element) => element.style.setProperty("border", "none", "important"));