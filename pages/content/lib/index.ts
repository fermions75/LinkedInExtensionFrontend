const POST_HOLDER_ID = 'fie-impression-container';
const EDITOR_CLASS = 'ql-editor';

const scrapData = async () => {
  const root = document.querySelector('#algo-engage-root');

  if (!root) return;

  const commentArticleHolder = root.closest('article');
  const postHolder = root.closest('div#' + POST_HOLDER_ID);

  const seeMoreButton = postHolder?.querySelector(
    `button[aria-label="see more, visually reveals content which is already detected by screen readers"]`,
  );
  if (seeMoreButton) {
    (seeMoreButton as HTMLButtonElement).click();
    await new Promise(resolve => setTimeout(resolve, 1200));
    //smooth scroll to the root
    root.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const postHeader =
    (
      postHolder?.querySelector('.update-components-actor__name span[aria-hidden="true"]') as HTMLElement
    )?.textContent?.trim() || ''; //done

  const postContent = (postHolder?.querySelector('.update-components-text') as HTMLElement)?.innerText.trim() || ''; //done

  let commentThread = commentArticleHolder?.textContent || null;
  let commentThread1 = '';
  let replyingTo = 'Replying to post';

  //add tje root comment
  if (commentArticleHolder) {
    const commentatorName =
      commentArticleHolder
        ?.querySelector('span.comments-post-meta__name-text')
        ?.textContent?.trim() || '';
    const commentText =
      commentArticleHolder?.querySelector('.comments-comment-item__main-content')?.textContent?.trim() || '';
    commentThread1 += `${commentatorName}:\n ${commentText}\n`;
  }

  //add all the replies
  console.log('commentArticleHolder: ', commentArticleHolder);
  const comments = commentArticleHolder?.querySelectorAll('.comments-comment-item') || [];
  comments.forEach(reply => {
    const replierName =
      reply.querySelector('.comments-post-meta__name-text span[aria-hidden="true"]')?.textContent?.trim() || '';
    const replyText = reply.querySelector('.comments-comment-item__main-content')?.textContent?.trim() || '';

    commentThread1 += `${replierName}:\n ${replyText}\n`;
  });

  // console.log('Post Header kaka: ', postHeader);
  // console.log('Post Content: ', postContent);
  // console.log('Article Content: ', commentThread1);

  if (commentThread) {
    commentThread = commentThread.replace(/like(\n|\s){2,}reply/g, '');
    const toReplying = postHolder?.querySelector(`.${EDITOR_CLASS} a.ql-mention`)?.textContent;
    replyingTo = "Replying to comment of '" + toReplying + "'";
  }

  //   console.log('Post Header: ', postHeader);
  //   console.log('Post Content: ', postContent);
  //   console.log('Article Content: ', commentArticle);
  //   console.log('Replying To: ', replyingTo);

  return { postHeader, postContent, commentThread: commentThread1, replyingTo };
};

async function scrapAdvice() {
  const root = document.querySelector('#algo-engage-root');
  if (!root) return;

  let contribution = root.closest('li.contribution');
  if (!contribution) return;

  let postHeader = contribution.querySelector('a span')?.textContent || '';
  let postContentHolder = contribution.querySelector('div.contribution__text-wrapper');

  if (postContentHolder && postContentHolder.querySelector('button')) {
    postContentHolder.querySelector('button')?.click();
    await new Promise(r => setTimeout(r, 1200));
    root.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  let postContent = postContentHolder?.textContent;

  console.log({
    postContent,
    postHeader,
  });

  return {
    postHeader,
    postContent,
    commentThread: null,
    replyingTo: 'Replying to the post',
  };
}

async function scrapArticle() {
  const root = document.querySelector('#algo-engage-root');
  if (!root) return;

  let article = root.closest('aside')?.previousElementSibling;
  if (!article) return;

  let postHeader = article.querySelector('h1.reader-article-header__title')?.textContent || '';
  let postContent = article.querySelector('div.reader-article-content')?.textContent || '';

  console.log("article Selector");
  console.log({postHeader,postContent});

  return {
    postHeader,
    postContent,
    commentThread: null,
    replyingTo: 'Replying to article',
  };
}

async function appendComment(delta: string) {
  const root = document.querySelector('#algo-engage-root');
  if (!root) return;

  const qlEditor = root.closest('form')?.querySelector(`div.${EDITOR_CLASS} p`);
  if (!qlEditor) return;

  if (delta === '<clear>') {
    //remove the last text node
    const lastNode = qlEditor.lastChild;
    if (lastNode && lastNode.nodeType === Node.TEXT_NODE) {
      qlEditor.removeChild(lastNode);
    }
    if (qlEditor.querySelector('a')) qlEditor.innerHTML += ' ';
  } else if (delta === '<end>') {
    //do nothing
  } else qlEditor.innerHTML += delta;

  //send fake event
}

async function appendAdvice(delta: string) {
  const root = document.querySelector('#algo-engage-root');
  if (!root) return;

  const textArea = root.closest('div.contribution__reply-input-wrapper')?.querySelector('textarea');
  if (!textArea) return;

  if (delta === '<clear>') textArea.value = '';
  else if (delta === '<end>') {
    const bt = textArea.nextElementSibling?.querySelector(
      "button[data-tracking-control-name='reply_post']",
    ) as HTMLButtonElement;
    bt.disabled = false;
  } else textArea.value += delta;

  //send fake event
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   console.log('Content Script: ', request);
  if (request.action === 'getDataForCommentGeneration') {
    if (window.location.href.includes('https://www.linkedin.com/advice')) {
      scrapAdvice().then(data => {
        chrome.runtime.sendMessage({ action: 'commentGenerationData', data });
      });
    } else if (
      window.location.href.includes('https://www.linkedin.com/advice') ||
      window.location.href.includes('https://www.linkedin.com/pulse')
    ) {
      scrapArticle().then(data => {
        chrome.runtime.sendMessage({ action: 'commentGenerationData', data });
      });
    } else
      scrapData().then(data => {
        chrome.runtime.sendMessage({ action: 'commentGenerationData', data });
      });
  } else if (request.action === 'generatedCommentDelta') {
    if (window.location.href.includes('https://www.linkedin.com/advice')) {
      appendAdvice(request.delta);
    }
    appendComment(request.delta);
  }
});
