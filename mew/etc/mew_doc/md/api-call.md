<span class="api-call">
    <span class="api-call-type"><tmpl:md content="node.children.type[0].contents"/></span>
    <tmpl:if test="node.children['tag']">
        <span class="api-call-tags">
            <tmpl:map list="node.children['tag']">
                <tmpl:md content="item.contents"/>
            </tmpl:map>
        </span>
    </tmpl:if>
    <tmpl:if test="node.children['text']">
        <span class="api-call-texts">
            <tmpl:map list="node.children['text']">
                <tmpl:md content="item.contents"/>
            </tmpl:map>
        </span>
    </tmpl:if>
</span>
