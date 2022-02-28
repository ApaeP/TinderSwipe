import { Controller } from "stimulus"
import Hammer from 'hammerjs'

export default class extends Controller {
  static targets = [ "card", "nopeBtn", "likeBtn" ]

  connect() {
    this.initCards();
    this.initSwipe();

    this.nopeBtnTarget.addEventListener('click', (e) => {
      this.createButtonListener(false, e)
    });

    this.likeBtnTarget.addEventListener('click', (e) => {
      this.createButtonListener(true, e)
    });
  }

  initCards(card, index) {
    var cards = this.cardTargets.filter(e => !e.classList.contains('removed'))

    cards.forEach((card, index) => {
      card.style.zIndex = cards.length - index;
      card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
      card.style.opacity = (10 - index) / 10;
    });

    this.element.classList.add('loaded');
  }

  initSwipe() {
    this.cardTargets.forEach((el) => {
      var hammertime = new Hammer(el);

      hammertime.on('pan', (event) => {
        el.classList.add('moving');
      });

      hammertime.on('pan', (event) => {
        if (event.deltaX === 0) return;
        if (event.center.x === 0 && event.center.y === 0) return;

        this.element.classList.toggle('tinder_love', event.deltaX > 0);
        this.element.classList.toggle('tinder_nope', event.deltaX < 0);

        var xMulti = event.deltaX * 0.03;
        var yMulti = event.deltaY / 80;
        var rotate = xMulti * yMulti;

        event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
      });

      hammertime.on('panend', (event) => {
        el.classList.remove('moving');
        this.element.classList.remove('tinder_love');
        this.element.classList.remove('tinder_nope');

        var moveOutWidth = document.body.clientWidth;
        var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

        if (!keep && event.additionalEvent === 'panright') {
          this.liked(event.target.dataset.id)
        } else if (!keep && event.additionalEvent === 'panleft') {
          this.disliked(event.target.dataset.id)
        }

        event.target.classList.toggle('removed', !keep);

        if (keep) {
          event.target.style.transform = '';
        } else {
          var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
          var toX = event.deltaX > 0 ? endX : -endX;
          var endY = Math.abs(event.velocityY) * moveOutWidth;
          var toY = event.deltaY > 0 ? endY : -endY;
          var xMulti = event.deltaX * 0.03;
          var yMulti = event.deltaY / 80;
          var rotate = xMulti * yMulti;

          console.log(toX)


          event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
          this.initCards();
        }
      });
    });
  }

  createButtonListener(love, event) {
    const cards = this.cardTargets.filter(e => !e.classList.contains('removed'));
    const moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    const card = cards[0];
    card.classList.add('removed');

    if (love) {
      card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
    } else {
      card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
    }

    this.initCards();
    event.preventDefault();
  }

  liked(elementId) {
    console.log(`liked id ${elementId}`)
  }

  disliked(elementId) {
    console.log(`disliked id ${elementId}`)
  }
}
