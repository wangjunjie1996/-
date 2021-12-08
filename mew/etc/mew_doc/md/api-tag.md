<tmpl:if test="!node.children['parameter']">
    <span class="api-tag api-tag-no-parameter">
        <span class="api-tag-name"><tmpl:md content="node.children['name'][0].contents"/></span>
    </span>
</tmpl:if>
<tmpl:if test="node.children['parameter']">
    <span class="api-tag">
        <span class="api-tag-name"><tmpl:md content="node.children['name'][0].contents"/></span>
        <span class="api-tag-parameter"><tmpl:md content="node.children['parameter'][0].contents"/></span>
    </span>
</tmpl:if>
