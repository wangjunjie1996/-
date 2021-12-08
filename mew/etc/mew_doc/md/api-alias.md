<span class="api-alias">
    <span class="api-alias-name"><tmpl:md content="node.attributes.name"/></span>
    <tmpl:if test="node.children['tag']">
        <span class="api-alias-tags">
            <tmpl:map list="node.children['tag']">
                <tmpl:md content="item.contents"/>
            </tmpl:map>
        </span>
    </tmpl:if>
    <tmpl:if test="node.children['text']">
        <span class="api-alias-texts">
            <tmpl:map list="node.children['text']">
                <tmpl:md content="item.contents"/>
            </tmpl:map>
        </span>
    </tmpl:if>
</span>
