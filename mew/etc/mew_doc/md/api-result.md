<span class="api-result">
    <tmpl:if test="node.attributes.name">
        <tmpl:if test="!node.children.type">
            <span class="api-result-name api-result-no-type"><tmpl:md content="node.attributes.name"/></span>
        </tmpl:if>
        <tmpl:if test="node.children.type">
            <span class="api-result-name"><tmpl:md content="node.attributes.name"/></span>
            <span class="api-result-separator">: </span>
        </tmpl:if>
    </tmpl:if>
    <tmpl:if test="node.children.type">
        <span class="api-result-type"><tmpl:md content="node.children.type[0].contents"/></span>
    </tmpl:if>
    <tmpl:if test="node.children['tag']">
        <span class="api-result-tags">
            <tmpl:map list="node.children['tag']">
                <tmpl:md content="item.contents"/>
            </tmpl:map>
        </span>
    </tmpl:if>
    <tmpl:if test="node.children['text'] || node.children['subparameter']">
        <span class="api-result-texts">
            <tmpl:if test="node.children['text']">
                <tmpl:map list="node.children['text']">
                    <tmpl:md content="item.contents"/>
                </tmpl:map>
            </tmpl:if>
            <tmpl:if test="node.children['subparameter']">
                <ul class="api-result-subparameters">
                    <tmpl:map list="node.children['subparameter']">
                        <li class="api-result-subparameter"><tmpl:md content="item.contents"/></li>
                    </tmpl:map>
                </ul>
            </tmpl:if>
        </span>
    </tmpl:if>
</span>
