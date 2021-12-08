<span class="api-parameter">
    <tmpl:if test="!node.children.type">
        <span class="api-parameter-name api-parameter-no-type"><tmpl:md content="node.attributes.name"/></span>
    </tmpl:if>
    <tmpl:if test="node.children.type">
        <span class="api-parameter-name"><tmpl:md content="node.attributes.name"/></span>
        <span class="api-parameter-separator">: </span>
        <span class="api-parameter-type"><tmpl:md content="node.children.type[0].contents"/></span>
    </tmpl:if>
    <tmpl:if test="node.children['tag']">
        <span class="api-parameter-tags">
            <tmpl:map list="node.children['tag']">
                <tmpl:md content="item.contents"/>
            </tmpl:map>
        </span>
    </tmpl:if>
    <tmpl:if test="node.children['text'] || node.children['subparameters']">
        <span class="api-parameter-texts">
            <tmpl:if test="node.children['text']">
                <tmpl:map list="node.children['text']">
                    <tmpl:md content="item.contents"/>
                </tmpl:map>
            </tmpl:if>
            <tmpl:if test="node.children['subparameter']">
                <ul class="api-parameter-subparameters">
                    <tmpl:map list="node.children['subparameter']">
                        <li class="api-parameter-subparameter"><tmpl:md content="item.contents"/></li>
                    </tmpl:map>
                </ul>
            </tmpl:if>
        </span>
    </tmpl:if>
</span>
