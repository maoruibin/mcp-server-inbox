/**
 * inBox client used to interact with the inBox API.
 */
export class InboxClient {
  private readonly apiUrl: string;

  /**
   * Create a new inBox client.
   * @param options - The configuration options
   * @param options.userToken - The user token for the inBox API, or complete API URL starting with @
   */
  constructor({ userToken }: { userToken: string }) {
    if (userToken.startsWith('@')) {
      // 如果以@开头，直接使用后面的URL
      this.apiUrl = userToken.substring(1);
    } else {
      // 否则使用默认域名和token拼接
      this.apiUrl = `https://app.gudong.site/api/inbox/${userToken}`;
    }
  }

  /**
   * Write a note to inBox.
   * @param title - Optional title of the note.
   * @param content - The content of the note.
   * @returns The response from the inBox API.
   */
  async writeNote({ title, content }: { title?: string; content: string }) {
    try {
      if (!content) {
        throw new Error("invalid content");
      }

      // 检查内容长度
      if (content.length > 3000) {
        throw new Error("note content exceeds 3000 characters limit");
      }

      // 构建请求体，直接传递 title 和 content 参数
      const req: { content: string; title?: string } = {
        content,
      };

      // 如果有title参数，添加到请求中
      if (title) {
        req.title = title;
      }

      const resp = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });

      if (!resp.ok) {
        throw new Error(`request failed with status ${resp.statusText}`);
      }

      return resp.json();
    } catch (e) {
      throw e;
    }
  }
} 