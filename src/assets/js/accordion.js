 (function(){
      // Simple, accessible accordion
      const accordion = document.getElementById('faqAccordion');
      const items = Array.from(accordion.querySelectorAll('.item'));
      const allowMultiple = accordion.hasAttribute('data-multiple') && accordion.getAttribute('data-multiple') !== 'false';

      function closeItem(item){
        const panel = item.querySelector('.panel');
        panel.style.maxHeight = null;
        item.setAttribute('aria-expanded','false');
      }
      function openItem(item){
        const panel = item.querySelector('.panel');
        // set maxHeight to scrollHeight so CSS transition animates
        panel.style.maxHeight = panel.scrollHeight + 'px';
        item.setAttribute('aria-expanded','true');
      }
      function toggleItem(item){
        const expanded = item.getAttribute('aria-expanded') === 'true';
        if(expanded){ closeItem(item); }
        else{
          if(!allowMultiple){
            items.forEach(i=>{ if(i !== item) closeItem(i); });
          }
          openItem(item);
        }
      }

      // initialize - ensure panels collapsed and set IDs
      items.forEach((item, idx)=>{
        const trigger = item.querySelector('.trigger');
        const panel = item.querySelector('.panel');
        // ensure unique ids if missing
        if(!trigger.id) trigger.id = `ctrl-${idx}`;
        if(!panel.id) panel.id = `panel-${idx}`;

        // set ARIA on trigger
        trigger.setAttribute('aria-expanded','false');
        trigger.setAttribute('aria-controls', panel.id);

        // collapse panel
        panel.style.maxHeight = null;

        // click
        trigger.addEventListener('click', ()=> toggleItem(item));

        // keyboard support for trigger
        trigger.addEventListener('keydown', (e)=>{
          const key = e.key;
          const currentIndex = items.indexOf(item);
          if(key === 'ArrowDown'){
            e.preventDefault();
            const next = items[(currentIndex+1) % items.length];
            next.querySelector('.trigger').focus();
          } else if(key === 'ArrowUp'){
            e.preventDefault();
            const prev = items[(currentIndex-1 + items.length) % items.length];
            prev.querySelector('.trigger').focus();
          } else if(key === 'Home'){
            e.preventDefault();
            items[0].querySelector('.trigger').focus();
          } else if(key === 'End'){
            e.preventDefault();
            items[items.length-1].querySelector('.trigger').focus();
          } else if(key === 'Enter' || key === ' '){
            e.preventDefault();
            toggleItem(item);
          }
        });
      });

      // handle window resize to update max-heights of opened panels
      window.addEventListener('resize', ()=>{
        items.forEach(i=>{
          if(i.getAttribute('aria-expanded') === 'true'){
            const panel = i.querySelector('.panel');
            panel.style.maxHeight = panel.scrollHeight + 'px';
          }
        });
      });

      // optional: open first item on load
      // openItem(items[0]);
    })();