const _ = require('lodash');

const html = `
<sls-template slot="header">
  <title>sls3</title>
</sls-template>
<div id='app'></div>
<%=  if ( [%- data.b %] === 1 ) { %>
<script src="//assets.xiaojukeji.com/??kui/lib/1.2.27/vue2.js"></script> 
<%= } else if ([%- data.b %] === 2 ) {%>
<script src="//sadasdasdas.js"></script> 
<%= } %>
`;

const compiled = _.template(html, {
  interpolate: /\[%=([\s\S]+?)%\]/g,
  escape: /\[%-([\s\S]+?)%\]/g,
  evaluate: /\[%([\s\S]+?)%\]/g,
});
console.log(compiled({ data: { b: 2 } }));
