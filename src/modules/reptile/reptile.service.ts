import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ReptileService {
  async fetchList() {
    const url = 'https://www.btbtt11.com/forum-index-fid-981.htm';

    const result = await axios
      .get(url, {})
      .then((response) => {
        const $ = cheerio.load(response.data);
        const links = [];

        $('table[tid]').each((index, element) => {
          const e = $(element);
          const types = [];
          const typeEles = e.find('.subject_type');
          const linkEles = e.find('.subject_link');

          const link = linkEles.eq(0);
          const originalName = link.text().trim();
          if (!originalName.includes('BT下载')) return;
          const linkHref = link.attr('href');
          const tid = linkHref.match(/tid-(\d+)/)?.[1];
          const fid = linkHref.match(/fid-(\d+)/)?.[1];
          const text = originalName.replace(/\[/g, '').replace(/\]/g, ',');
          const textArr = text.split(',').filter((item) => item);

          typeEles.each((index, element) => {
            const type = $(element);
            const typeText = type.text().trim();
            const href = type.attr('href');
            // forum-index-fid-981-typeid3-36982.htm href typeidx = 3 is groupId 36982 is typeId
            const typeGroupId = href.match(/typeid(\d+)/)?.[1];
            const typeTypeId = href.match(/typeid\d+-(\d+)/)?.[1];

            types.push({
              name: typeText.replace(/\[|\]/g, ''),
              gid: typeGroupId,
              tid: typeTypeId,
            });
          });

          const linkData = {
            tid,
            fid,
            fileType: textArr[4],
            name: textArr[1],
            lang: textArr[3],
            update: textArr[2],
            resolution: textArr[5],
            source: textArr[6],
            types,
          };

          links.push({ ...linkData });
        });

        console.log(links);

        return links;

        const pages = $('.page')?.[0]?.children as any;

        const pageData = pages.map((i) => ({
          name: i.children[0].data,
          href: i.attribs.href,
          checked: i.attribs.class === 'checked',
        }));

        console.log(pageData);

        return links;
      })
      .catch((error) => {
        console.error(`在爬取 ${url} 时发生错误: ${error}`);
      });

    return result;
  }

  async fetchDetail() {
    const url = 'https://www.btbtt11.com/thread-index-fid-981-tid-4875619.htm';

    const result = await axios
      .get(url, {})
      .then((response) => {
        const $ = cheerio.load(response.data);
        const info = $('.post_table').eq(0);
        const poster = info.find('img').eq(0).attr('src');
        const descriptions = info
          .find('p span')
          .map((index, element) => {
            const e = $(element);
            return e.text().trim();
          })
          .get()
          .filter((item) => item);

        const tables = $('.post_table').slice(1);
        const tableData = tables
          .map((index, element) => {
            const e = $(element);
            const source = e
              .find('p')
              .map((index, element) => {
                const e = $(element);
                const a = e.find('a');
                const name = a.text().trim() || e.text().trim();
                return name;
              })
              .get();

            const attachs = e
              .find('.attachlist tr')
              .map((index, element) => {
                const e = $(element);
                const a = e.find('a');
                const href = a.attr('href');
                const name = a.text().trim();
                const aid = href?.match(/aid-(\d+)/)?.[1];
                // 下载地址
                // attach-download-fid-981-aid-6278834.htm
                // 爬取到的附件详情地址
                // attach-dialog-fid-981-aid-6278834.htm
                return {
                  name,
                  href: `https://www.btbtt11.com/attach-download-fid-981-aid-${aid}.htm`,
                  aid,
                };
              })
              .get()
              .filter((item) => item.name);

            return {
              source,
              attachs,
            };
          })
          .get()
          .filter((item) => item.attachs.length);

        return {
          poster,
          descriptions,
          attachs: tableData,
        };
      })
      .catch((error) => {
        console.error(`在爬取 ${url} 时发生错误: ${error}`);
      });

    return result;
  }
}
