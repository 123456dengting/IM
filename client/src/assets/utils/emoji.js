import emojiImg from "@/assets/images/emoji.png"

class Emoji{
    constructor(emojiIndex = 0,emojiSize = 20){
        this.emojiIndex = emojiIndex;
        this.emojiSize = emojiSize;
        return this.createEmoji();
    }
    createEmoji(){
        let posiX = this.emojiIndex * this.emojiSize;
        let label = document.createElement("im-emoji");
            label.setAttribute("emojiIndex",this.emojiIndex);
            label.setAttribute("contenteditable","false");
            label.style.display = `inline-block`;
            label.style.background = `url(${emojiImg}) no-repeat -${posiX}px  0px`;
            label.style.width = `${this.emojiSize}px`;
            label.style.height = `${this.emojiSize}px`;
            label.style["background-size"] = `auto ${this.emojiSize}px`;
            return label;
    }
}

export default Emoji;